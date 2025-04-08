import React, { useEffect } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import BackToMenuButton from '@/components/BackToMenuButton';
import GameFooter from '@/components/GameFooter';
import GameHeader from '@/components/GameHeader';
import NavHeader from '@/components/NavHeader';
import ThemeButton from '@/components/ThemeButton';
import DifficultyCarousel from '../components/DifficultyCarousel';
import HintsButton from './components/controls/HintsButton';
import PencilButton from './components/controls/PencilButton';
import RestartButton from './components/controls/RestartButton';
import UndoButton from './components/controls/UndoButton';
import NumberButtons from './components/NumberButtons';
import SudokuGrid from './components/SudokuGrid';
import TimerText from './components/TimerText';
import { isSolved } from './sudokuLib';
import { useSudokuState } from './sudokuState';
import { difficulties } from './sudokuTypes';
import LeaderboardButton from '@/components/LeaderboardButton';
import SudokuSettingsButton from './components/controls/SudokuSettingsButton';

const Sudoku: React.FC = () => {
  const { seed, isActive, difficulty, grid, reset, stop } = useSudokuState();

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (grid.length > 0 && isSolved(grid)) stop();
  }, [grid, stop]);

  return (
    grid.length > 0 && (
      <AnimatedPage depth={1}>
        <NavHeader>
          <BackToMenuButton />
          <div className="flex h-full w-full justify-end">
            <LeaderboardButton
              game="sudoku"
              seed={seed}
              shouldOpen={isActive && isSolved(grid)}
              difficulty={difficulty}
              difficulties={[...difficulties]}
            />
            <ThemeButton />
            <SudokuSettingsButton />
          </div>
        </NavHeader>
        <GameHeader>
          <TimerText className="w-2/5 text-center text-2xl" />
          <DifficultyCarousel
            className="h-full w-2/5"
            difficulty={difficulty}
            difficulties={[...difficulties]}
            reset={reset}
          />
        </GameHeader>
        <div className="flex h-full w-full flex-col items-center justify-evenly">
          <SudokuGrid />
          <NumberButtons />
        </div>
        <GameFooter>
          <RestartButton />
          <HintsButton />
          <PencilButton />
          <UndoButton />
        </GameFooter>
      </AnimatedPage>
    )
  );
};

export default Sudoku;
