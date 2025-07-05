// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playRobotRouter from './server'; // This is your router

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount the PlayRobot router
app.use('/api/play', playRobotRouter);

// Optional: test route
app.get('/', (_req, res) => {
  res.send('Chess AI Backend is Running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});
