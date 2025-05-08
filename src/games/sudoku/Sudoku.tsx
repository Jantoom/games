import BasicPage from '@/components/containers/BasicPage';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import Page from '@/components/containers/Page';
import TimerText from '@/components/elements/TimerText';
import { LeaderboardDialog } from '@/components/generics/Leaderboard';
import { ResetPrompt, ResetBody } from '@/components/generics/Reset';
import Grid from '@/games/sudoku/components/body/Grid';
import NumberButtons from '@/games/sudoku/components/body/NumberButtons';
import HintsButton from '@/games/sudoku/components/footer/HintsButton';
import PencilButton from '@/games/sudoku/components/footer/PencilButton';
import ResetButton from '@/games/sudoku/components/footer/ResetButton';
import UndoButton from '@/games/sudoku/components/footer/UndoButton';
import Leaderboard from '@/games/sudoku/components/sections/Leaderboard';
import Settings from '@/games/sudoku/components/sections/Settings';
import { useSudokuStore } from '@/games/sudoku/state';
import { difficulties } from '@/games/sudoku/types';
import { isSolved } from '@/games/sudoku/utils';
import { useStatusCheck } from '@/hooks/use-status-check';
import { useTimer } from '@/hooks/use-timer';

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

  useStatusCheck(
    'sudoku',
    status,
    () => isSolved(grid),
    () => stop(true),
  );

  useTimer(status, () => tick());

  return (
    status !== 'create' && (
      <Page seed={seed}>
        <Header>{optShowTime && <TimerText time={time} />}</Header>
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
