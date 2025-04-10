import React, { useEffect } from 'react';
import AnimatedPage from '../components/containers/AnimatedPage';
import Footer from '../components/containers/Footer';
import Header from '../components/containers/Header';
import TimerText from '../components/elements/TimerText';
import HintsButton from '@/sudoku/components/controls/HintsButton';
import PencilButton from '@/sudoku/components/controls/PencilButton';
import RestartButton from '@/sudoku/components/controls/RestartButton';
import UndoButton from '@/sudoku/components/controls/UndoButton';
import Grid from '@/sudoku/components/game/Grid';
import NumberButtons from '@/sudoku/components/game/NumberButtons';
import { useSudokuState } from '@/sudoku/state';
import { isSolved } from './utils';
import Settings from '@/minesweeper/components/Settings';

const Sudoku: React.FC = () => {
  const { isActive, grid, reset, stop, setState } = useSudokuState();

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (grid.length > 0 && isSolved(grid)) stop(true);
  }, [grid, stop]);

  return (
    grid.length > 0 && (
      <AnimatedPage depth={1}>
        <Header settings={<Settings />}>
          <TimerText
            className="w-full text-center text-2xl"
            isActive={isActive}
            set={setState}
          />
        </Header>
        <div className="flex flex-grow w-full flex-col items-center justify-evenly">
          <Grid />
          <NumberButtons />
        </div>
        <Footer>
          <RestartButton />
          <HintsButton />
          <PencilButton />
          <UndoButton />
        </Footer>
      </AnimatedPage>
    )
  );
};

export default Sudoku;
