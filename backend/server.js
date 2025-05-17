const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://zoober:LxxbzNMzZoHmcl1T@gozoober.hsdlwmr.mongodb.net/fruit-ninja', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Score Schema
const scoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
  date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Routes
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1 })
      .limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/scores', async (req, res) => {
  try {
    const score = new Score({
      name: req.body.name,
      score: req.body.score
    });
    const newScore = await score.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 