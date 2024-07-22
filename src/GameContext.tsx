import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

interface Cell {
  isAlive: boolean;
  liveNeighbors: number;
}

interface GameContextType {
  board: Cell[][];
  evolveBoard: () => void;
  goToPrevBoard: () => void;
  goToNextBoard: () => void;
  size: number;
  setSize: (size: number) => void;
  initializeBoard: () => void;
  currentStep: number;
  canGoBack: boolean;
  canGoForward: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const directions: [number, number][] = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [size, setSize] = useState(10);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [history, setHistory] = useState<Cell[][][]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const initializeBoard = useCallback(() => {
    const newBoard = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({
        isAlive: Math.random() < 0.5,
        liveNeighbors: 0
      }))
    );

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (newBoard[row][col].isAlive) {
          for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
              newBoard[newRow][newCol].liveNeighbors += 1;
            }
          }
        }
      }
    }

    setBoard(newBoard);
    setHistory([newBoard]);
    setCurrentStep(0);
  }, [size]);

  const evolveBoard = () => {
    const lastStep = history[history.length - 1];
    const newBoard = lastStep.map(row => row.map(cell => ({ ...cell })));
    let changes: { row: number; col: number; newState: boolean }[] = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = lastStep[row][col];
        if (cell.isAlive && (cell.liveNeighbors < 2 || cell.liveNeighbors > 3)) {
          changes.push({ row, col, newState: false });
        } else if (!cell.isAlive && cell.liveNeighbors === 3) {
          changes.push({ row, col, newState: true });
        }
      }
    }

    for (const { row, col, newState } of changes) {
      const cell = newBoard[row][col];
      const increment = newState ? 1 : -1;
      cell.isAlive = newState;

      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
          newBoard[newRow][newCol].liveNeighbors += increment;
        }
      }
    }

    setBoard(newBoard);
    setHistory([...history, newBoard]);
    setCurrentStep(history.length);
  };

  const goToPrevBoard = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setBoard(history[currentStep - 1]);
    }
  };

  const goToNextBoard = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      setBoard(history[currentStep + 1]);
    }
  };

  useEffect(() => {
    initializeBoard();
  }, [size, initializeBoard]);

  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < history.length - 1;

  return (
    <GameContext.Provider value={{ board, evolveBoard, goToPrevBoard, goToNextBoard, size, setSize, initializeBoard, currentStep, canGoBack, canGoForward }}>
      {children}
    </GameContext.Provider>
  );
};
