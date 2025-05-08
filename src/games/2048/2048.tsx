import BasicPage from '@/components/containers/BasicPage';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import Page from '@/components/containers/Page';
import TimerText from '@/components/elements/TimerText';
import { LeaderboardDialog } from '@/components/generics/Leaderboard';
import { ResetPrompt, ResetBody } from '@/components/generics/Reset';
import Grid from '@/games/2048/components/body/Grid';
import NumberButtons from '@/games/2048/components/body/NumberButtons';
import HintsButton from '@/games/2048/components/footer/HintsButton';
import PencilButton from '@/games/2048/components/footer/PencilButton';
import ResetButton from '@/games/2048/components/footer/ResetButton';
import UndoButton from '@/games/2048/components/footer/UndoButton';
import Leaderboard from '@/games/2048/components/sections/Leaderboard';
import Settings from '@/games/2048/components/sections/Settings';
import { use2048Store } from '@/games/2048/state';
import { difficulties } from '@/games/2048/types';
import { isSolved } from '@/games/2048/utils';
import { useStatusCheck } from '@/hooks/use-status-check';
import { useTimer } from '@/hooks/use-timer';

const _2048Play: React.FC = () => {
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
  } = use2048Store();

  useStatusCheck(
    '2048',
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

const _2048Create: React.FC = () => {
  const { status, difficulty, reset } = use2048Store();
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

const _2048Settings: React.FC = () => {
  return (
    <BasicPage>
      <Settings />
    </BasicPage>
  );
};

const _2048Leaderboard: React.FC = () => {
  return (
    <BasicPage>
      <Leaderboard />
    </BasicPage>
  );
};

export { _2048Play, _2048Create, _2048Settings, _2048Leaderboard };
