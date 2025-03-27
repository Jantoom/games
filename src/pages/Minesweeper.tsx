import React, { useCallback, useEffect } from 'react';
import AnimatedPage from './AnimatedPage';
import MinesweeperGrid from '@/components/minesweeper/MinesweeperGrid';
import { useMinesweeperState } from '@/states/minesweeperState';
import { Difficulty } from '@/lib/sudokuTypes';
import seedrandom from 'seedrandom';
import { generateMinesweeper, getSafeCells, isSolved } from '@/lib/minesweeper';
import { LeaderboardEntry } from '@/lib/minesweeperTypes';
import TimerText from '@/components/minesweeper/TimerText';
import DifficultyButtons from '@/components/minesweeper/DifficultyButtons';

const Minesweeper: React.FC = () => {
  const { seed, grid, reset, update, stop } = useMinesweeperState();

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (grid.length > 0 && isSolved(grid)) stop();
  }, [grid, stop]);

  return (
    <AnimatedPage>
      <div
        key={seed}
        className="flex flex-col h-svh items-center py-8"
      >
        <div className="flex flex-col items-center justify-between h-screen">
          <div className="flex justify-between items-center w-full">
            <TimerText />
            <DifficultyButtons reset={reset} />
          </div>
          <MinesweeperGrid />
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Minesweeper;
