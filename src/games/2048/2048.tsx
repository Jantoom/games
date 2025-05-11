import BasicPage from '@/components/containers/BasicPage';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import Page from '@/components/containers/Page';
import { LeaderboardDialog } from '@/components/generics/Leaderboard';
import { ResetPrompt, ResetBody } from '@/components/generics/Reset';
import { Label } from '@/components/ui/label';
import Grid from '@/games/2048/components/body/Grid';
import Leaderboard from '@/games/2048/components/sections/Leaderboard';
import Settings from '@/games/2048/components/sections/Settings';
import { use2048Store } from '@/games/2048/state';
import { difficulties } from '@/games/2048/types';
import { isFinished } from '@/games/2048/utils';
import { useStatusCheck } from '@/hooks/use-status-check';

const _2048Play: React.FC = () => {
  const { status, seed, score, difficulty, cells, optShowScore, reset, stop } =
    use2048Store();

  useStatusCheck(
    '2048',
    status,
    () => isFinished(cells),
    () => {
      console.log(cells);
      stop(true);
    },
  );

  return (
    status !== 'create' && (
      <Page seed={seed}>
        <Header>
          {optShowScore && (
            <Label
              className="relative w-full text-center font-medium"
              onClick={() => console.log(cells)}
            >
              {score}
            </Label>
          )}
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
        />
        {status === 'finished' && isFinished(cells) && (
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
