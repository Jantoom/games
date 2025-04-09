import React, { useEffect } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import BackToMenuButton from '@/components/BackToMenuButton';
import DifficultyCarousel from '@/components/DifficultyCarousel';
import GameFooter from '@/components/GameFooter';
import GameHeader from '@/components/GameHeader';
import LeaderboardButton from '@/components/LeaderboardButton';
import NavHeader from '@/components/NavHeader';
import ThemeButton from '@/components/ThemeButton';
import TimerText from '@/components/TimerText';
import HintsButton from '@/sudoku/components/controls/HintsButton';
import PencilButton from '@/sudoku/components/controls/PencilButton';
import RestartButton from '@/sudoku/components/controls/RestartButton';
import SettingsButton from '@/sudoku/components/controls/SettingsButton';
import UndoButton from '@/sudoku/components/controls/UndoButton';
import Grid from '@/sudoku/components/game/Grid';
import NumberButtons from '@/sudoku/components/game/NumberButtons';
import { useSudokuState } from '@/sudoku/state';
import { difficulties } from '@/sudoku/types';
import { isSolved } from './utils';

const Sudoku: React.FC = () => {
  const { seed, isActive, difficulty, grid, reset, stop, setState } =
    useSudokuState();

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
            <SettingsButton />
          </div>
        </NavHeader>
        <GameHeader>
          <TimerText
            className="w-2/5 text-center text-2xl"
            isActive={isActive}
            set={setState}
          />
          <DifficultyCarousel
            className="h-full w-2/5"
            difficulty={difficulty}
            difficulties={[...difficulties]}
            reset={reset}
          />
        </GameHeader>
        <div className="flex h-full w-full flex-col items-center justify-evenly">
          <Grid />
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
