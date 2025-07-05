import { spawn, ChildProcess } from 'child_process';

interface StockfishInstance {
  send: (command: string) => void;
  onBestMove: (callback: (move: string) => void) => void;
  engine: ChildProcess;
}

export function CreateStockfish(skillLevel: number = 5): StockfishInstance {
  const engine = spawn('stockfish');

  // Error handling for spawn
  engine.on('error', (err) => {
    console.error('Failed to start Stockfish:', err);
  });

  // Initialize engine
  engine.stdin.write('uci\n');
  engine.stdin.write(`setoption name Skill Level value ${skillLevel}\n`);

  function send(command: string): void {
    engine.stdin.write(command + '\n');
  }

  function onBestMove(callback: (move: string) => void): void {
    engine.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      const lines = output.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('bestmove')) {
          const move = line.split(' ')[1];
          if (move && move !== '(none)') {
            callback(move);
          }
        }
      }
    });
  }

  return { send, onBestMove, engine };
}
