import React, { useState, useRef, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import HandTracker from './HandTracker';
import Scoreboard from './Scoreboard';
import StartScreen from './StartScreen';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('start'); // start, running, gameover
  const scoreRef = useRef(0);
  const slicesRef = useRef([]); // {x1, y1, x2, y2, timestamp}
  const trailRef = useRef([]);
  const handTrackerRef = useRef();

  // Fullscreen dynamic size
  const [gameSize, setGameSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setGameSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = () => {
    scoreRef.current = 0;
    setGameState('running');
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  const handleSlice = (slice) => {
    slicesRef.current.push(slice);
  };

  const handleScore = () => {
    scoreRef.current += 1;
  };

  const handleRestart = () => {
    scoreRef.current = 0;
    setGameState('start');
  };

  return (
    <div className="App game-area" style={{ width: '100vw', height: '100vh', minHeight: 0, minWidth: 0 }}>
      {/* <div style={{ color: 'red', position: 'absolute', zIndex: 10000 }}>
        DEBUG: App is rendering<br/>
        width: {String(gameSize.width)}, height: {String(gameSize.height)}
      </div> */}
      <HandTracker
        onSlice={handleSlice}
        running={gameState === 'running'}
        ref={handTrackerRef}
        width={gameSize.width}
        height={gameSize.height}
        trailRef={trailRef}
      />
      <GameCanvas
        running={gameState === 'running'}
        slicesRef={slicesRef}
        onScore={handleScore}
        onGameOver={handleGameOver}
        width={gameSize.width}
        height={gameSize.height}
        trail={trailRef.current}
      />
      {gameState === 'gameover' && <Scoreboard score={scoreRef.current} />}
      {/* Only overlays are conditional, game area is always mounted */}
      {gameState !== 'running' && (
        <StartScreen
          key={gameState}
          onStart={gameState === 'start' ? handleStart : handleRestart}
          gameOver={gameState === 'gameover'}
          score={scoreRef.current}
        />
      )}

    </div>
  );
}

export default App;
