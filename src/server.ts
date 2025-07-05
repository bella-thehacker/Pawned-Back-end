import express from 'express';
import { getBestMoveFromInput } from './PlayRobot';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { difficulty, fen } = req.body;
    const result = await getBestMoveFromInput(difficulty, fen);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
