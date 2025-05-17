import React, { useState, useEffect } from 'react';

const API_URL = 'https://webcam-ninja-okfn.onrender.com/api';

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await fetch(`${API_URL}/scores`);
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      const data = await response.json();
      console.log('Fetched global leaderboard:', data);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboard responsive-leaderboard" style={{ 
      background: 'rgba(255, 246, 0, 0.9)', 
      color: '#000', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '2px solid #f00',
      width: '90vw',
      maxWidth: '350px',
      minWidth: 'unset',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      margin: '0 auto',
      marginTop: 16,
      marginBottom: 16
    }}>
      <h2 style={{ 
        color: '#d32f2f', 
        fontSize: '24px', 
        marginBottom: '16px', 
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        Global Leaderboard
      </h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '16px', color: '#666' }}>
          Loading scores...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '16px', color: '#d32f2f' }}>
          {error}
        </div>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ background: '#ffeb3b' }}>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                borderBottom: '2px solid #000', 
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                Player Name
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'right', 
                borderBottom: '2px solid #000', 
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(leaderboard) && leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr key={entry._id || index} style={{ 
                  background: index === 0 ? 'rgba(255, 235, 59, 0.2)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    fontWeight: index === 0 ? 'bold' : 'normal',
                    fontSize: '16px'
                  }}>
                    {entry.name}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    fontWeight: index === 0 ? 'bold' : 'normal',
                    fontSize: '16px'
                  }}>
                    {entry.score}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ 
                  padding: '16px', 
                  textAlign: 'center', 
                  color: '#666',
                  fontSize: '16px'
                }}>
                  No scores yet! Start playing to get on the leaderboard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function Scoreboard({ score }) {
  return (
    <div className="scoreboard">
      <span>{score}</span>
    </div>
  );
}
