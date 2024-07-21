import express, { Request, Response } from 'express';

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

type Cell = {
  isAlive: boolean;
  liveNeighbors: number;
};

let board: Cell[][] = [];
let size: number = 10;

const directions: [number, number][] = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

const initializeBoard = (req: Request, res: Response): void => {
  size = req.body.size || 10;
  board = Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => ({
      isAlive: Math.random() < 0.5,
      liveNeighbors: 0
    }))
  );

  // Initialize neighbor counts based on the random board
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].isAlive) {
        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
          if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
            board[newRow][newCol].liveNeighbors += 1;
          }
        }
      }
    }
  }

  res.json({ board });
};

const retrieveBoardState = (req: Request, res: Response): void => {
  res.json({ board });
};

const evolveBoardLogic = (): void => {
  let changes: { row: number; col: number; newState: boolean }[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = board[row][col];
      if (cell.isAlive && (cell.liveNeighbors < 2 || cell.liveNeighbors > 3)) {
        changes.push({ row, col, newState: false });
      } else if (!cell.isAlive && cell.liveNeighbors === 3) {
        changes.push({ row, col, newState: true });
      }
    }
  }

  for (const { row, col, newState } of changes) {
    updateCellState(row, col, newState);
  }
};

const updateCellState = (row: number, col: number, newState: boolean): void => {
  const cell = board[row][col];
  if (cell.isAlive !== newState) {
    const increment = newState ? 1 : -1;
    cell.isAlive = newState;

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        board[newRow][newCol].liveNeighbors += increment;
      }
    }
  }
};

app.post('/api/initialize', initializeBoard);
app.get('/api/board', retrieveBoardState);
app.post('/api/evolve', (req: Request, res: Response) => {
  evolveBoardLogic();
  res.json({ board });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
