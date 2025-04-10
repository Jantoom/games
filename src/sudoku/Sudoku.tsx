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
import Settings from '@/sudoku/components/Settings';
import Body from '@/components/containers/Body';

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
          <TimerText isActive={isActive} set={setState} />
        </Header>
        <Body>
          <Grid />
          <NumberButtons />
        </Body>
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
