import React from 'react';

interface CellProps {
  isAlive: boolean;
  liveNeighbors: number;
}

const Cell = ({ isAlive, liveNeighbors }: CellProps) => {
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center ${
        isAlive ? 'bg-green-500' : 'bg-white'
      } border border-gray-300 transition-colors duration-300 ease-in-out`}
    >
      <span className="text-xs text-gray-500">{liveNeighbors}</span>
    </div>
  );
};

export default Cell;
