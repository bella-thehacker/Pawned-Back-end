import { CreateStockfish } from './CreateStockfish';

interface StockfishSettings {
  skillLevel: number;
  depth: number;
}

const difficultySettings: Record<string, StockfishSettings> = {
  beginner: { skillLevel: 1, depth: 2 },
  casual: { skillLevel: 5, depth: 4 },
  sharp: { skillLevel: 12, depth: 8 },
  grandmaster: { skillLevel: 20, depth: 15 },
};

export async function getBestMoveFromInput(
  difficulty: string,
  fen: string
): Promise<{ bestMove: string }> {
  if (!difficulty || !fen) {
    throw new Error('Missing difficulty or FEN');
  }

  const settings = difficultySettings[difficulty.toLowerCase()];
  if (!settings) {
    throw new Error('Invalid difficulty level');
  }

  const bestMove = await getBestMove(fen, settings.skillLevel, settings.depth);
  return { bestMove };
}

function getBestMove(fen: string, skillLevel: number, depth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const stockfish = CreateStockfish(skillLevel);

    const timeout = setTimeout(() => {
      stockfish.engine.kill();
      reject(new Error('Stockfish timed out'));
    }, 10000);

    stockfish.onBestMove((move) => {
      clearTimeout(timeout);
      stockfish.engine.kill();
      resolve(move);
    });

    stockfish.send(`position fen ${fen}`);
    stockfish.send(`go depth ${depth}`);
  });
}
