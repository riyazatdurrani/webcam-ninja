import React from 'react';

export default function StartScreen({ 
  onStart, 
  gameOver, 
  score, 
  playerName, 
  onNameChange, 
  speedMultiplier, 
  onSpeedChange,
  isMusicEnabled,
  onMusicToggle,
  isMobile,
  LeaderboardComponent
}) {
  return (
    <div
      className="start-screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
        marginBottom: 160,
        opacity: 1,
        transform: 'scale(1)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <div style={{ margin: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={e => onNameChange(e.target.value)}
          style={{
            fontSize: '1.2rem',
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            outline: 'none',
            width: 220
          }}
        />
        
        <div style={{ 
          background: '#222', 
          padding: '12px 20px', 
          borderRadius: 8,
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <label style={{ color: '#fff', fontSize: '1rem', textAlign: 'center' }}>
            Game Speed
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Slow</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speedMultiplier}
              onChange={e => onSpeedChange(Number(e.target.value))}
              style={{ 
                flex: 1,
                height: '6px',
                WebkitAppearance: 'none',
                background: '#444',
                borderRadius: '3px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Fast</span>
          </div>
          <div style={{ textAlign: 'center', color: '#ffeb3b', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {speedMultiplier.toFixed(1)}x
          </div>

          <div style={{ 
            marginTop: '8px', 
            paddingTop: '12px', 
            borderTop: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <label style={{ color: '#fff', fontSize: '1rem' }}>
              Background Music
            </label>
            <button
              onClick={() => onMusicToggle(!isMusicEnabled)}
              style={{
                background: isMusicEnabled ? '#4CAF50' : '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {isMusicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      <button 
        className="start-btn" 
        onClick={onStart} 
        disabled={!playerName || playerName.trim().length === 0}
      >
        {gameOver ? 'Restart' : 'Start'}
      </button>

      <h1 style={{ fontSize: '3rem', marginTop: 24, marginBottom: 0 }}>
        {gameOver ? 'Game Over!' : 'WebNinja'}
      </h1>
      {gameOver && (
        <div style={{ fontSize: '1.5rem', margin: '16px 0' }}>
          Your Score: <span style={{ color: '#ffeb3b' }}>{score}</span>
        </div>
      )}
      
      <div style={{ marginTop: 24, color: '#aaa', maxWidth: 500, textAlign: 'center' }}>
        <p style={{ marginBottom: 16 }}>
          Use your hand in front of the webcam to slice falling objects!<br />
          Make a fast movement to slice. Don't let any object touch the bottom line!
        </p>
        
        <div style={{ 
          background: 'rgba(255, 0, 0, 0.1)', 
          border: '1px solid rgba(255, 0, 0, 0.3)',
          borderRadius: 8,
          padding: '16px',
          marginTop: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <img 
              src={process.env.PUBLIC_URL + '/images/danger.png'} 
              alt="Danger object" 
              style={{ 
                width: '40px', 
                height: '40px',
                filter: 'drop-shadow(0 0 4px rgba(255, 0, 0, 0.5))'
              }} 
            />
            <span style={{ color: '#ff4444', fontWeight: 'bold' }}>WARNING!</span>
          </div>
          <p style={{ color: '#ff4444', margin: 0 }}>
            Avoid slicing the danger object (shown above)!<br />
            If you hit it, the game will be over immediately.
          </p>

          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#fff',
              margin: '0 0 8px 0',
              fontWeight: 'bold' 
            }}>
              Developer: Riyazat Durrani
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '16px',
              fontSize: '0.9rem'
            }}>
              <a 
                href="https://x.com/riyazatdurrani?t=pawc-xhvtCFW_aykN6PGfg&s=08"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: '#1DA1F2',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Follow on X
              </a>
              <a 
                href="https://www.linkedin.com/in/riyazatdurrani?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: '#0077B5',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
        {isMobile && LeaderboardComponent && (
          <div style={{
            marginTop: 16,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <LeaderboardComponent />
          </div>
        )}
      </div>
    </div>
  );
}
