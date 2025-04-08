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
import ThemeButton from '@/components/ThemeButton';
import NavHeader from '@/components/NavHeader';
import GameHeader from '@/components/GameHeader';
import GameFooter from '@/components/GameFooter';

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
        <NavHeader>
          <BackToMenuButton />
          <div className="flex h-full w-full justify-end">
            <LeaderboardButton />
            <ThemeButton />
            <SettingsButton />
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
