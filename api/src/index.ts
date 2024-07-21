import express, { Request, Response } from 'express';

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let board: boolean[][] = [];
let neighborCounts: number[][] = [];
let size: number = 10;

const directions: [number, number][] = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

const initializeBoard = (req: Request, res: Response): void => {
  size = req.body.size || 10;
  board = Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => Math.random() < 0.5)
  );
  neighborCounts = Array(size).fill(null).map(() => Array(size).fill(0));

  // Initialize neighbor counts based on the random board
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col]) {
        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
          if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
            neighborCounts[newRow][newCol] += 1;
          }
        }
      }
    }
  }

  res.json({ board, neighborCounts });
};

const retrieveBoardState = (req: Request, res: Response): void => {
  res.json({ board });
};

const evolveBoardLogic = (): void => {
  let changes: [number, number, boolean][] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const liveNeighbors = neighborCounts[row][col];
      if (board[row][col] && (liveNeighbors < 2 || liveNeighbors > 3)) {
        changes.push([row, col, false]);
      } else if (!board[row][col] && liveNeighbors === 3) {
        changes.push([row, col, true]);
      }
    }
  }

  for (const [row, col, newState] of changes) {
    updateCellState(row, col, newState);
  }
};

const updateCellState = (row: number, col: number, newState: boolean): void => {
  const currentState = board[row][col];
  if (currentState !== newState) {
    board[row][col] = newState;
    const increment = newState ? 1 : -1;

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        neighborCounts[newRow][newCol] += increment;
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
