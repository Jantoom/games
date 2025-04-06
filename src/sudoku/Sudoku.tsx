import React, { useEffect } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import DifficultySelect from '@/components/DifficultySelect';
import HintsButton from './components/controls/HintsButton';
import LeaderboardButton from './components/controls/LeaderboardButton';
import PencilButton from './components/controls/PencilButton';
import RestartButton from './components/controls/RestartButton';
import UndoButton from './components/controls/UndoButton';
import NumberButtons from './components/NumberButtons';
import SudokuGrid from './components/SudokuGrid';
import TimerText from './components/TimerText';
import { isSolved } from './sudokuLib';
import { useSudokuState } from './sudokuState';
import { difficulties } from './sudokuTypes';
import BackToMenuButton from '@/components/BackToMenuButton';

const Sudoku: React.FC = () => {
  const { seed, difficulty, grid, reset, stop } = useSudokuState();

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (grid.length > 0 && isSolved(grid)) stop();
  }, [grid, stop]);

  return (
    grid.length > 0 && (
      <AnimatedPage>
        <div key={seed} className="flex h-svh flex-col items-center py-8">
          <div className="flex h-screen flex-col items-center justify-between">
            <div className="grid grid-cols-3 w-full justify-items-center items-start">
              <BackToMenuButton />
              <TimerText />
              <DifficultySelect
                difficulty={difficulty}
                difficulties={[...difficulties]}
                reset={reset}
              />
            </div>
            <SudokuGrid />
            <NumberButtons />
            <div className="flex w-full justify-evenly">
              <RestartButton />
              <HintsButton />
              <PencilButton />
              <UndoButton />
              <LeaderboardButton />
            </div>
          </div>
        </div>
      </AnimatedPage>
    )
  );
};

export default Sudoku;
