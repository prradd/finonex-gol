import React from 'react';
import { useGame } from '@/GameContext';
import Cell from './Cell';

const GameBoard = () => {
  const { board } = useGame();

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${board.length}, 2rem)` }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} isAlive={cell.isAlive} liveNeighbors={cell.liveNeighbors} />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
