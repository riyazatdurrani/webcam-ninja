import React, { useRef, useEffect, useMemo } from 'react';
import { randInt, lineIntersectsCircle } from './utils';
import ReactDOM from 'react-dom';

// Preload images
const IMAGE_FILENAMES = [
  '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', 'special.png', 'danger.png'
];
const loadedImages = IMAGE_FILENAMES.map(name => {
  const img = new window.Image();
  img.src = process.env.PUBLIC_URL + '/images/' + name;
  return img;
});

// Use dynamic width/height for fullscreen
// const CANVAS_WIDTH = 480;
// const CANVAS_HEIGHT = 640;
const OBJECT_RADIUS = 60;
const SPAWN_INTERVAL = 900; // ms
const MIN_SPEED = 200;
const MAX_SPEED = 500;

// Danger sound
const dangerAudio = new window.Audio(process.env.PUBLIC_URL + '/danger.wav');

function randomObject(width, height, speedMultiplier = 1) {
  // Make danger.png rare
  let imgIndex;
  const dangerIndex = IMAGE_FILENAMES.indexOf('danger.png');
  if (Math.random() < 0.05) { // 5% chance for danger
    imgIndex = dangerIndex;
  } else {
    // Pick a random non-danger image
    let pool = IMAGE_FILENAMES.filter((name) => name !== 'danger.png');
    imgIndex = IMAGE_FILENAMES.indexOf(pool[Math.floor(Math.random() * pool.length)]);
  }
  const img = loadedImages[imgIndex];
  const isDanger = IMAGE_FILENAMES[imgIndex] === 'danger.png';
  return {
    x: randInt(OBJECT_RADIUS, width - OBJECT_RADIUS),
    y: -OBJECT_RADIUS,
    r: OBJECT_RADIUS,
    image: img,
    speed: (MIN_SPEED + Math.pow(Math.random(), 2) * (MAX_SPEED - MIN_SPEED)) * speedMultiplier,
    id: Math.random().toString(36).slice(2),
    sliced: false,
    type: isDanger ? 'danger' : 'normal',
  };
}

export default React.memo(function GameCanvas({ running, slicesRef, onScore, onGameOver, width = 480, height = 640, trail = [], speedMultiplier = 1 }) {
  const canvasRef = useRef();
  const objectsRef = useRef([]);
  const lastSpawnRef = useRef(Date.now());
  const animationRef = useRef();
  const gameOverRef = useRef(false);
  const contextRef = useRef(null);

  // Initialize canvas context once
  useEffect(() => {
    if (!contextRef.current && canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d');
    }
  }, []);

  // Reset on new game
  useEffect(() => {
    if (running) {
      objectsRef.current = [];
      gameOverRef.current = false;
      lastSpawnRef.current = Date.now();
    }
  }, [running]);

  // Main game loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!running || !contextRef.current) return;
    
    const ctx = contextRef.current;
    let lastFrameTime = Date.now();

    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      // Draw bottom line
      const BOTTOM_LINE_Y = height - 32;
      ctx.save();
      ctx.strokeStyle = '#ff5252';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, BOTTOM_LINE_Y);
      ctx.lineTo(width, BOTTOM_LINE_Y);
      ctx.stroke();
      ctx.restore();

      // Draw objects as images
      ctx.save();
      for (const obj of objectsRef.current) {
        if (obj.image && obj.image.complete) {
          ctx.drawImage(
            obj.image,
            obj.x - obj.r,
            obj.y - obj.r,
            obj.r * 2,
            obj.r * 2
          );
        } else {
          // fallback: draw a circle if image not loaded
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
          ctx.fillStyle = obj.type === 'danger' ? '#ff0000' : '#ccc';
          ctx.fill();
        }
      }
      ctx.restore();

      // Draw fingertip trail if available
      if (trail?.length > 1) {
        ctx.save();
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
        ctx.restore();

        // Draw a circle at the fingertip
        const tip = trail[trail.length - 1];
        ctx.save();
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = '#00e5ff';
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
      }
    }

    function update(deltaTime) {
      const now = Date.now();
      const BOTTOM_LINE_Y = height - 32;
      
      // Spawn new objects
      if (now - lastSpawnRef.current > SPAWN_INTERVAL) {
        // 70% chance to spawn 1, 25% for 2, 5% for 3
        const rand = Math.random();
        let numToSpawn = 1;
        if (rand > 0.95) numToSpawn = 3;
        else if (rand > 0.7) numToSpawn = 2;
        for (let i = 0; i < numToSpawn; i++) {
          objectsRef.current.push(randomObject(width, height, speedMultiplier));
        }
        lastSpawnRef.current = now;
      }

      // Move objects
      for (const obj of objectsRef.current) {
        if (!obj.sliced) {
          obj.y += obj.speed * deltaTime;
        }
      }

      // Remove objects that are out of bounds or sliced
      for (let i = objectsRef.current.length - 1; i >= 0; i--) {
        const obj = objectsRef.current[i];
        if (obj.y >= height + obj.r || obj.sliced) {
          objectsRef.current.splice(i, 1);
        }
      }

      // Check for game over
      for (const obj of objectsRef.current) {
        if (obj.type === 'normal' && obj.y + obj.r >= BOTTOM_LINE_Y) {
          gameOverRef.current = true;
          onGameOver(false);
          return;
        }
      }

      // Check for slices if available
      const currentSlices = slicesRef?.current;
      if (currentSlices?.length > 0) {
        for (const slice of currentSlices) {
          for (const obj of objectsRef.current) {
            if (!obj.sliced && lineIntersectsCircle(slice.x1, slice.y1, slice.x2, slice.y2, obj.x, obj.y, obj.r)) {
              if (obj.type === 'danger') {
                dangerAudio.currentTime = 0;
                dangerAudio.play();
                gameOverRef.current = true;
                onGameOver(true);
                return;
              } else {
                obj.sliced = true;
                onScore();
              }
            }
          }
        }
        // Clear slices for next frame
        if (slicesRef.current) {
          slicesRef.current = [];
        }
      }
    }

    function loop() {
      const now = Date.now();
      const deltaTime = (now - lastFrameTime) / 1000; // seconds
      lastFrameTime = now;
      update(deltaTime);
      draw();
      if (!gameOverRef.current) {
        animationRef.current = requestAnimationFrame(loop);
      }
    }

    lastFrameTime = Date.now();
    loop();
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [running, width, height, onScore, onGameOver, speedMultiplier]);

  const canvasElement = useMemo(() => (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: running ? 'block' : 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        background: 'transparent',
        borderRadius: 0,
      }}
    />
  ), [width, height, running]);

  return ReactDOM.createPortal(canvasElement, document.getElementById('game-canvas-root'));
});
