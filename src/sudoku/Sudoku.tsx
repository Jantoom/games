import React, { useEffect } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import DifficultyCarousel from '../components/DifficultyCarousel';
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
import SettingsButton from '@/components/SettingsButton';
import ThemeButton from '@/menu/components/ThemeButton';

const Sudoku: React.FC = () => {
  const { difficulty, grid, reset, stop } = useSudokuState();

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (grid.length > 0 && isSolved(grid)) stop();
  }, [grid, stop]);

  return (
    grid.length > 0 && (
      <AnimatedPage depth={1}>
        <div className="flex h-svh w-[50vh] max-w-[95vw] flex-col justify-self-center py-8">
          <div className="flex h-full w-full flex-col items-center justify-between">
            <div className="h-[7.5%] w-full">
              <div className="flex h-1/2 w-full flex-wrap items-center justify-center gap-y-2">
                <div className="w-1/3">
                  <BackToMenuButton />
                </div>
                <TimerText className="w-1/3 text-center text-3xl" />
                <div className="flex h-full w-1/3 justify-end gap-1">
                  <LeaderboardButton />
                  <ThemeButton />
                  <SettingsButton />
                </div>
                <DifficultyCarousel
                    className="w-1/3 justify-self-center"
                    difficulty={difficulty}
                    difficulties={[...difficulties]}
                    reset={reset}
                  />
              </div>
            </div>
            <SudokuGrid />
            <NumberButtons />
            <div className="flex h-[5%] w-full justify-evenly">
              <RestartButton />
              <HintsButton />
              <PencilButton />
              <UndoButton />
            </div>
          </div>
        </div>
      </AnimatedPage>
    )
  );
};

export default Sudoku;
