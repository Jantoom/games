import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/containers/Page';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import ThemeButton from '@/components/elements/ThemeButton';
import { ResetPrompt, ResetSetup } from '@/components/generics/Reset';
import TimerText from '@/components/generics/TimerText';
import HintsButton from './components/footer/HintsButton';
import PencilButton from './components/footer/PencilButton';
import UndoButton from './components/footer/UndoButton';
import Grid from './components/body/Grid';
import NumberButtons from './components/body/NumberButtons';
import Settings from './components/sections/Settings';
import { useSudokuState } from '@/sudoku/state';
import { isSolved } from '@/sudoku/utils';
import { difficulties } from './types';
import ResetButton from './components/footer/ResetButton';
import {
  LeaderboardButton,
  LeaderboardDialog,
} from '@/components/generics/Leaderboard';
import Leaderboard from './components/sections/Leaderboard';

const SudokuCreate: React.FC = () => {
  const { status, read, reset } = useSudokuState();

  useEffect(() => {
    const saveData = read();
    if (status === 'create' && saveData?.status !== 'create') {
      reset(undefined, saveData);
    }
  }, [status, read, reset]);

  return (
    <Page>
      <Header title="Sudoku" back="menu" />
      <Body variant="create">
        <ResetSetup
          status={status}
          reset={reset}
          difficulties={[...difficulties]}
        />
        <Settings />
      </Body>
      <Footer>
        <LeaderboardButton leaderboard={<Leaderboard />} />
        <ThemeButton />
      </Footer>
    </Page>
  );
};

const SudokuPlay: React.FC = () => {
  const {
    status,
    seed,
    time,
    grid,
    optShowTime,
    read,
    save,
    reset,
    stop,
    tick,
  } = useSudokuState();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'create') {
      const saveData = read();
      if (!saveData?.status || saveData.status === 'create') {
        navigate('/games/sudoku/create');
      } else {
        reset(undefined, saveData);
      }
    } else if (status === 'play' && isSolved(grid)) {
      stop(true);
    }
  }, [status, grid, read, reset, stop, navigate]);

  return (
    status !== 'create' && (
      <Page seed={seed} save={save}>
        <Header title="Sudoku" back="create" settings={<Settings />}>
          {optShowTime && <TimerText init={time} status={status} tick={tick} />}
        </Header>
        <Body variant="play">
          <Grid />
          {status === 'play' && <NumberButtons />}
        </Body>
        <Footer
          status={status}
          reset={<ResetPrompt reset={reset} difficulties={[...difficulties]} />}
        >
          <ResetButton />
          <PencilButton />
          <UndoButton />
          <HintsButton />
        </Footer>
        {status === 'finished' && isSolved(grid) && (
          <LeaderboardDialog delay>
            <Leaderboard />
          </LeaderboardDialog>
        )}
      </Page>
    )
  );
};

export { SudokuCreate, SudokuPlay };
