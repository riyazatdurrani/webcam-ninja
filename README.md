# Webcam Ninja

A React-based game that uses webcam and hand tracking for slicing falling objects, similar to Fruit Ninja but with hand gestures.

## Features

- Real-time hand tracking using MediaPipe
- Dynamic object spawning with varying speeds
- Gesture-based slicing mechanics
- Score tracking
- Fullscreen gameplay
- Visual trail following finger movement

## Tech Stack

- React
- MediaPipe Hands for hand tracking
- HTML5 Canvas for rendering
- Modern JavaScript (ES6+)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/riyazatdurrani/webcam-ninja.git
cd webcam-ninja
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to play the game.

## How to Play

1. Allow webcam access when prompted
2. Click "Start" to begin the game
3. Use your index finger to slice the falling objects
4. Make quick horizontal movements to slice
5. Don't let objects touch the bottom line!

## Requirements

- Modern web browser with WebGL support
- Webcam
- Node.js 14+ for development
