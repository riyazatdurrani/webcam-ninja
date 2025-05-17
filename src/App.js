import React, { useState, useRef, useEffect } from 'react';
import { inject } from '@vercel/analytics';
import GameCanvas from './GameCanvas';
import HandTracker from './HandTracker';
import Scoreboard, { Leaderboard } from './Scoreboard';
import StartScreen from './StartScreen';
import './App.css';

// Initialize Vercel Analytics
inject();

const sliceAudio = new Audio(process.env.PUBLIC_URL + '/slice.mp3');
const gameOverAudio = new Audio(process.env.PUBLIC_URL + '/gameover.mp3');
const backgroundMusic = new Audio(process.env.PUBLIC_URL + '/background.mp3');
backgroundMusic.loop = true; // Enable looping
backgroundMusic.volume = 0.05; // Set volume to 5%

function App() {
  const [gameState, setGameState] = useState('start'); // start, running, gameover
  const scoreRef = useRef(0);
  const slicesRef = useRef([]); // {x1, y1, x2, y2, timestamp}
  const trailRef = useRef([]);
  const handTrackerRef = useRef();
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [playerName, setPlayerName] = useState('');
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  // Handle background music
  useEffect(() => {
    if (gameState === 'running' && isMusicEnabled) {
      backgroundMusic.currentTime = 0; // Start from beginning
      backgroundMusic.play().catch(error => console.log('Background music autoplay prevented:', error));
    } else {
      backgroundMusic.pause();
    }
  }, [gameState, isMusicEnabled]);

  // Fullscreen dynamic size
  const [gameSize, setGameSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setGameSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = () => {
    scoreRef.current = 0;
    setGameState('running');
  };

  const handleGameOver = async (byDanger = false) => {
    // Only play game over sound if not caused by danger object
    if (!byDanger) {
      gameOverAudio.currentTime = 0;
      gameOverAudio.play();
    }
    
    // Stop background music
    backgroundMusic.pause();

    // Save to global leaderboard
    if (playerName && playerName.trim().length > 0) {
      try {
        const response = await fetch('https://webcam-ninja-okfn.onrender.com/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playerName.trim(),
            score: scoreRef.current
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save score');
        }

        console.log('Score saved to global leaderboard:', {
          name: playerName,
          score: scoreRef.current
        });
      } catch (error) {
        console.error('Error saving to global leaderboard:', error);
      }
    }
    setGameState('gameover');
  };

  const handleSlice = (slice) => {
    slicesRef.current.push(slice);
  };

  const handleScore = () => {
    scoreRef.current += 1;
    sliceAudio.currentTime = 0;
    sliceAudio.play();
  };

  const handleRestart = () => {
    scoreRef.current = 0;
    setGameState('start');
  };

  return (
    <div className="App game-area" style={{ width: '100vw', height: '100vh', minHeight: 0, minWidth: 0, position: 'relative', overflow: 'visible' }}>
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
        speedMultiplier={speedMultiplier}
      />
      {gameState === 'gameover' && <Scoreboard score={scoreRef.current} />}
      {/* Only overlays are conditional, game area is always mounted */}
      {gameState !== 'running' && (
        <div style={{
          width: '100vw',
          maxWidth: '100vw',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'rgba(24,28,32,0.95)',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 100
        }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'static' }}>
            <StartScreen
              key={gameState}
              onStart={gameState === 'start' ? handleStart : handleRestart}
              gameOver={gameState === 'gameover'}
              score={scoreRef.current}
              playerName={playerName}
              onNameChange={setPlayerName}
              speedMultiplier={speedMultiplier}
              onSpeedChange={setSpeedMultiplier}
              isMusicEnabled={isMusicEnabled}
              onMusicToggle={setIsMusicEnabled}
              isMobile={isMobile}
              LeaderboardComponent={isMobile ? Leaderboard : null}
            />
          </div>
          {!isMobile && (
            <div style={{ 
              position: 'fixed',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 150
            }}>
              <Leaderboard />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
