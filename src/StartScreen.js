import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function StartScreen({ onStart, gameOver, score }) {
  return (
    <motion.div
      className="start-screen"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4 }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: 0 }}>
        {gameOver ? 'Game Over!' : 'Webcam Slice Game'}
      </h1>
      {gameOver && (
        <div style={{ fontSize: '1.5rem', margin: '16px 0' }}>
          Your Score: <span style={{ color: '#ffeb3b' }}>{score}</span>
        </div>
      )}
      <button className="start-btn" onClick={onStart}>
        {gameOver ? 'Restart' : 'Start'}
      </button>
      <p style={{ marginTop: 32, color: '#aaa', maxWidth: 400 }}>
        Use your hand in front of the webcam to slice falling objects!<br />
        Make a fast horizontal movement to slice. Don’t let any object touch the bottom line!
      </p>
    </motion.div>
  );
}
