import React from 'react';

export default function Scoreboard({ score }) {
  return (
    <div className="scoreboard">
      <span>{score}</span>
    </div>
  );
}
