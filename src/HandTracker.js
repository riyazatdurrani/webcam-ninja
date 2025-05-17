import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const TRAIL_LENGTH = 10;

// Singleton for MediaPipe Hands instance
let handsSingleton = null;

const HandTracker = forwardRef(({ onSlice, running, width = 480, height = 640, trailRef }, ref) => {
  const videoRef = useRef();
  const cameraRef = useRef();
  const lastPosRef = useRef(null);

  useImperativeHandle(ref, () => ({}));

  // Create MediaPipe Hands instance ONCE for the app
  if (!handsSingleton) {
    handsSingleton = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    handsSingleton.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
  }

  useEffect(() => {
    if (!running) return;
    let camera;

    function onResults(results) {
      // Check if we have valid hand landmarks
      if (!results?.multiHandLandmarks?.[0]?.[8]) return;
      
      const landmarks = results.multiHandLandmarks[0];
      // Index finger tip is landmark 8
      let x = landmarks[8].x * width;
      let y = landmarks[8].y * height;
      // Mirror X to match webcam
      x = width - x;
      const now = Date.now();

      // Update trail if trailRef exists
      if (trailRef?.current) {
        trailRef.current.push({ x, y, timestamp: now });
        if (trailRef.current.length > TRAIL_LENGTH) {
          trailRef.current.shift();
        }
      }

      // Slicing gesture detection
      const prev = lastPosRef.current;
      if (prev) {
        const dx = x - prev.x;
        const dy = y - prev.y;
        const dt = now - prev.timestamp;
        if ((Math.abs(dx) > 30 || Math.abs(dy) > 30) && dt < 200) {
          onSlice({ x1: prev.x, y1: prev.y, x2: x, y2: y, timestamp: now });
        }
      }
      lastPosRef.current = { x, y, timestamp: now };
    }

    // Only set onResults once
    handsSingleton.onResults(onResults);

    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          try {
            await handsSingleton.send({ image: videoRef.current });
          } catch (error) {
            console.warn('Hand tracking error:', error);
          }
        },
        width,
        height,
        facingMode: 'user'
      });
      cameraRef.current = camera;
      camera.start();
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      // Do NOT close handsSingleton here; keep it alive for app lifetime
    };
  }, [running, onSlice, width, height, trailRef]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      width={width}
      height={height}
      className="webcam-bg"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        objectFit: 'cover',
        zIndex: 0,
        background: '#000',
        transform: 'scaleX(-1)',
      }}
    />
  );
});

export default HandTracker;
