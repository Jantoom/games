import React, { useEffect } from 'react';
import AnimatedPage from '@/components/containers/AnimatedPage';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import TimerText from '@/components/generics/TimerText';
import HintsButton from '@/sudoku/components/controls/HintsButton';
import PencilButton from '@/sudoku/components/controls/PencilButton';
import UndoButton from '@/sudoku/components/controls/UndoButton';
import Grid from '@/sudoku/components/game/Grid';
import NumberButtons from '@/sudoku/components/game/NumberButtons';
import { useSudokuState } from '@/sudoku/state';
import { isSolved } from '@/sudoku/utils';
import Settings from '@/sudoku/components/Settings';
import Body from '@/components/containers/Body';
import Reset from '@/components/generics/Reset';

const Sudoku: React.FC = () => {
  const { status, grid, optShowTime, reset, restart, stop, tick } =
    useSudokuState();

  useEffect(() => reset(), [reset]);

  useEffect(() => {
    if (status === 'play' && isSolved(grid)) stop(true);
  }, [status, grid, stop]);

  return (
    status === 'play' && (
      <AnimatedPage depth={1}>
        <Header settings={<Settings />}>
          {optShowTime && <TimerText active={status === 'play'} tick={tick} />}
        </Header>
        <Body>
          <Grid />
          <NumberButtons />
        </Body>
        <Footer
          reset={<Reset reset={() => reset()} restart={() => restart()} />}
        >
          <HintsButton />
          <PencilButton />
          <UndoButton />
        </Footer>
      </AnimatedPage>
    )
  );
};

export default Sudoku;
