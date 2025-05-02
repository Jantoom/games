import Page from '../components/containers/Page';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import { ResetPrompt, ResetBody } from '@/components/generics/Reset';
import TimerText from '../components/elements/TimerText';
import FlagButton from './components/footer/FlagButton';
import HintButton from './components/footer/HintButton';
import Grid from './components/body/Grid';
import Settings from './components/sections/Settings';
import { useMinesweeperStore } from '@/minesweeper/state';
import { isSolved } from '@/minesweeper/utils';
import { difficulties } from './types';
import BombCounter from './components/header/BombCounter';
import Leaderboard from './components/sections/Leaderboard';
import { LeaderboardDialog } from '@/components/generics/Leaderboard';
import BasicPage from '@/components/containers/BasicPage';
import { useStatusCheck } from '@/hooks/use-status-check';
import { useTimer } from '@/hooks/use-timer';

const MinesweeperPlay: React.FC = () => {
  const {
    status,
    seed,
    time,
    difficulty,
    grid,
    bombs,
    flags,
    optShowRemainingBombs,
    optShowTime,
    reset,
    stop,
    tick,
  } = useMinesweeperStore();

  useStatusCheck(
    'minesweeper',
    status,
    () => isSolved(grid, bombs, flags),
    () => stop(true),
  );

  useTimer(status, () => tick());

  return (
    status !== 'create' && (
      <Page seed={seed}>
        <Header>
          <div className="flex w-full flex-col items-center gap-y-1">
            {optShowRemainingBombs && <BombCounter />}
            {optShowTime && <TimerText time={time} />}
          </div>
        </Header>
        <Body>
          <Grid />
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
          <FlagButton />
          <HintButton />
        </Footer>
        {status === 'finished' && isSolved(grid, bombs, flags) && (
          <LeaderboardDialog delay>
            <Leaderboard allowDeletion={false} />
          </LeaderboardDialog>
        )}
      </Page>
    )
  );
};

const MinesweeperCreate: React.FC = () => {
  const { status, difficulty, reset } = useMinesweeperStore();
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

const MinesweeperSettings: React.FC = () => {
  return (
    <BasicPage>
      <Settings />
    </BasicPage>
  );
};

const MinesweeperLeaderboard: React.FC = () => {
  return (
    <BasicPage>
      <Leaderboard />
    </BasicPage>
  );
};

export {
  MinesweeperPlay,
  MinesweeperCreate,
  MinesweeperSettings,
  MinesweeperLeaderboard,
};
