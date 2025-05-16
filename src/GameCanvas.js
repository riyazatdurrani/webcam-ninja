import React, { useRef, useEffect, useMemo } from 'react';
import { randInt, randomColor, lineIntersectsCircle } from './utils';
import ReactDOM from 'react-dom';

// Use dynamic width/height for fullscreen
// const CANVAS_WIDTH = 480;
// const CANVAS_HEIGHT = 640;
const OBJECT_RADIUS = 28;
const SPAWN_INTERVAL = 900; // ms
const MIN_SPEED = 1.0;
const MAX_SPEED = 6.0;

function randomObject(width, height) {
  return {
    x: randInt(OBJECT_RADIUS, width - OBJECT_RADIUS),
    y: -OBJECT_RADIUS,
    r: OBJECT_RADIUS,
    color: randomColor(),
    speed: MIN_SPEED + Math.pow(Math.random(), 2) * (MAX_SPEED - MIN_SPEED),
    id: Math.random().toString(36).slice(2),
  };
}

export default React.memo(function GameCanvas({ running, slicesRef, onScore, onGameOver, width = 480, height = 640, trail = [] }) {
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
  useEffect(() => {
    if (!running || !contextRef.current) return;
    
    const ctx = contextRef.current;

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

      // Draw objects
      ctx.save();
      for (const obj of objectsRef.current) {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
        ctx.fillStyle = obj.color;
        ctx.shadowColor = obj.color;
        ctx.shadowBlur = 16;
        ctx.fill();
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

    function update() {
      const now = Date.now();
      const BOTTOM_LINE_Y = height - 32;
      
      // Spawn new objects
      if (now - lastSpawnRef.current > SPAWN_INTERVAL) {
        objectsRef.current.push(randomObject(width, height));
        lastSpawnRef.current = now;
      }

      // Move objects
      for (const obj of objectsRef.current) {
        if (!obj.sliced) {
          obj.y += obj.speed;
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
        if (obj.y + obj.r >= BOTTOM_LINE_Y) {
          gameOverRef.current = true;
          onGameOver();
          return;
        }
      }

      // Check for slices if available
      const currentSlices = slicesRef?.current;
      if (currentSlices?.length > 0) {
        for (const slice of currentSlices) {
          for (const obj of objectsRef.current) {
            if (!obj.sliced && lineIntersectsCircle(slice.x1, slice.y1, slice.x2, slice.y2, obj.x, obj.y, obj.r)) {
              obj.sliced = true;
              onScore();
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
      if (!gameOverRef.current) {
        update();
        draw();
        animationRef.current = requestAnimationFrame(loop);
      }
    }

    loop();
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [running, width, height, onScore, onGameOver, trail, slicesRef]);

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
