import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/containers/Page';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
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
  const { status, difficulty, read, reset } = useSudokuState();

  useEffect(() => {
    const saveData = read();
    if (status === 'create' && saveData?.status !== 'create') {
      reset(undefined, saveData);
    }
  }, [status, read, reset]);

  return (
    <Page>
      <Header />
      <Body>
        <ResetSetup
          status={status}
          reset={reset}
          difficulty={difficulty}
          difficulties={[...difficulties]}
        />
      </Body>
      <Footer>
        <LeaderboardButton leaderboard={<Leaderboard />} />
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
        <Header>
          {optShowTime && <TimerText init={time} status={status} tick={tick} />}
        </Header>
        <Body>
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

const SudokuSettings: React.FC = () => {
  return (
    <Page>
      <Header />
      <Body>
        <Settings />
      </Body>
      <Footer />
    </Page>
  );
};

const SudokuLeaderboard: React.FC = () => {
  return (
    <Page>
      <Header />
      <Body>
        <Leaderboard />
      </Body>
      <Footer />
    </Page>
  );
};

export { SudokuCreate, SudokuPlay, SudokuSettings, SudokuLeaderboard };
