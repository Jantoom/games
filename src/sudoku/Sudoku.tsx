import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/containers/AnimatedPage';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import LeaderboardButton from '@/components/elements/LeaderboardButton';
import ThemeButton from '@/components/elements/ThemeButton';
import { ResetDialog, ResetSetup } from '@/components/generics/Reset';
import TimerText from '@/components/generics/TimerText';
import { PageDepth } from '@/lib/types';
import HintsButton from './components/footer/HintsButton';
import PencilButton from './components/footer/PencilButton';
import UndoButton from './components/footer/UndoButton';
import Grid from './components/body/Grid';
import NumberButtons from './components/body/NumberButtons';
import Settings from './components/sections/Settings';
import { useSudokuState } from '@/sudoku/state';
import { isSolved } from '@/sudoku/utils';
import { difficulties } from './types';

const SudokuCreate: React.FC = () => {
  const { status, read, reset } = useSudokuState();

  return (
    <AnimatedPage pageDepth={PageDepth.Create}>
      <Header back="menu" />
      <Body variant="setup">
        <ResetSetup
          status={status}
          read={read}
          reset={reset}
          difficulties={[...difficulties]}
        />
        <Settings />
      </Body>
      <Footer>
        <LeaderboardButton game="sudoku" difficulties={[...difficulties]} />
        <ThemeButton />
      </Footer>
    </AnimatedPage>
  );
};

const SudokuPlay: React.FC = () => {
  const {
    status,
    time,
    grid,
    optShowTime,
    read,
    save,
    reset,
    restart,
    stop,
    tick,
  } = useSudokuState();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'setup') {
      const saveData = read();
      if (!saveData?.status || saveData.status === 'setup') {
        navigate('/games/sudoku/create');
      } else {
        reset(undefined, saveData);
      }
    } else if (status === 'play' && isSolved(grid)) {
      stop(true);
    }
  }, [status, grid, read, reset, stop, navigate]);

  return (
    status !== 'setup' && (
      <AnimatedPage pageDepth={PageDepth.Play} save={save}>
        <Header back="create" settings={<Settings />}>
          {optShowTime && <TimerText init={time} status={status} tick={tick} />}
        </Header>
        <Body variant="play">
          <Grid />
          {status === 'play' && <NumberButtons />}
        </Body>
        <Footer reset={<ResetDialog reset={reset} restart={restart} />}>
          <HintsButton />
          <PencilButton />
          <UndoButton />
        </Footer>
      </AnimatedPage>
    )
  );
};

export { SudokuCreate, SudokuPlay };
