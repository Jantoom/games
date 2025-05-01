import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/containers/Page';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import { ResetPrompt, ResetBody } from '@/components/generics/Reset';
import TimerText from '../components/elements/TimerText';
import HintsButton from './components/footer/HintsButton';
import PencilButton from './components/footer/PencilButton';
import UndoButton from './components/footer/UndoButton';
import Grid from './components/body/Grid';
import NumberButtons from './components/body/NumberButtons';
import Settings from './components/sections/Settings';
import { useSudokuStore } from '@/sudoku/state';
import { isSolved } from '@/sudoku/utils';
import { difficulties } from './types';
import ResetButton from './components/footer/ResetButton';
import { LeaderboardDialog } from '@/components/generics/Leaderboard';
import Leaderboard from './components/sections/Leaderboard';
import BasicPage from '@/components/containers/BasicPage';

const SudokuPlay: React.FC = () => {
  const {
    status,
    seed,
    time,
    difficulty,
    grid,
    optShowTime,
    reset,
    stop,
    tick,
  } = useSudokuStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'create') {
      navigate('/games/sudoku/create');
    } else if (status === 'play' && isSolved(grid)) {
      stop(true);
    }
  }, [status, grid, stop, navigate]);

  return (
    status !== 'create' && (
      <Page seed={seed}>
        <Header>
          {optShowTime && <TimerText init={time} status={status} tick={tick} />}
        </Header>
        <Body>
          <Grid />
          {status === 'play' && <NumberButtons />}
        </Body>
        <Footer
          status={status}
          reset={
            <ResetPrompt
              reset={reset}
              difficulty={difficulty}
              difficulties={[...difficulties]}
            />
          }
        >
          <ResetButton />
          <PencilButton />
          <UndoButton />
          <HintsButton />
        </Footer>
        {status === 'finished' && isSolved(grid) && (
          <LeaderboardDialog delay>
            <Leaderboard allowDeletion={false} />
          </LeaderboardDialog>
        )}
      </Page>
    )
  );
};

const SudokuCreate: React.FC = () => {
  const { status, difficulty, reset } = useSudokuStore();
  return (
    <BasicPage>
      <ResetBody
        status={status}
        reset={reset}
        difficulty={difficulty}
        difficulties={[...difficulties]}
      />
    </BasicPage>
  );
};

const SudokuSettings: React.FC = () => {
  return (
    <BasicPage>
      <Settings />
    </BasicPage>
  );
};

const SudokuLeaderboard: React.FC = () => {
  return (
    <BasicPage>
      <Leaderboard />
    </BasicPage>
  );
};

export { SudokuPlay, SudokuCreate, SudokuSettings, SudokuLeaderboard };
