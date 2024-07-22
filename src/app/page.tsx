'use client';
import React, { useState } from 'react';
import { GameProvider, useGame } from '@/GameContext';
import GameBoard from '../components/GameBoard';

const Home = () => {
  return (
    <GameProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-500 to-gray-400 py-2">
        <h1 className="text-4xl font-bold text-white mb-4">Game of Life</h1>
        <BoardSizeInput />
        <GameBoard />
        <div className="flex space-x-4 mt-4">
          <PreviousButton />
          <EvolveButton />
          <NextButton />
        </div>
        <StepCounter />
      </div>
    </GameProvider>
  );
};

const EvolveButton = () => {
  const { evolveBoard } = useGame();

  return (
    <button
      onClick={evolveBoard}
      className="px-6 py-2 w-24 bg-gray-600 text-white rounded shadow-lg hover:bg-gray-700 transition duration-300"
    >
      Evolve
    </button>
  );
};

const PreviousButton = () => {
  const { previousBoard, canGoBack } = useGame();

  return (
    <button
      onClick={previousBoard}
      disabled={!canGoBack}
      className={`px-6 py-2 w-24 rounded shadow-lg transition duration-300 ${canGoBack ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-400 text-gray-700'}`}
    >
      Prev
    </button>
  );
};

const NextButton = () => {
  const { nextBoard, canGoForward } = useGame();

  return (
    <button
      onClick={nextBoard}
      disabled={!canGoForward}
      className={`px-6 py-2 w-24 rounded shadow-lg transition duration-300 ${canGoForward ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-400 text-gray-700'}`}
    >
      Next
    </button>
  );
};

const StepCounter = () => {
  const { currentStep } = useGame();

  return (
    <div className="mt-4 text-white">
      Step: {currentStep}
    </div>
  );
};

const BoardSizeInput = () => {
  const { size, setSize, initializeBoard } = useGame();
  const [inputValue, setInputValue] = useState(size);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setInputValue(value);
    }
  };

  const handleSetSize = () => {
    setSize(inputValue);
    initializeBoard();
  };

  return (
    <div className="flex items-center mt-4 mb-4">
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        className="px-2 py-1 border border-gray-400 rounded"
      />
      <button
        onClick={handleSetSize}
        className="ml-2 px-4 py-1 bg-gray-600 text-white rounded shadow-lg hover:bg-gray-700 transition duration-300"
      >
        Set Size
      </button>
    </div>
  );
};

export default Home;
