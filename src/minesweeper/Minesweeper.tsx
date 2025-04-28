import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/containers/Page';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import { ResetPrompt, ResetSetup } from '@/components/generics/Reset';
import TimerText from '@/components/generics/TimerText';
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

const MinesweeperPlay: React.FC = () => {
  const {
    status,
    seed,
    time,
    grid,
    bombs,
    flags,
    optShowRemainingBombs,
    optShowTime,
    reset,
    stop,
    tick,
  } = useMinesweeperStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'create') {
      navigate('/games/minesweeper/create');
    } else if (status === 'play' && isSolved(grid, bombs, flags)) {
      stop(true);
    }
  }, [status, grid, bombs, flags, stop, navigate]);

  return (
    status !== 'create' && (
      <Page seed={seed}>
        <Header>
          <div className="flex w-full flex-col items-center gap-y-1">
            {optShowRemainingBombs && <BombCounter />}
            {optShowTime && (
              <TimerText init={time} status={status} tick={tick} />
            )}
          </div>
        </Header>
        <Body>
          <Grid />
        </Body>
        <Footer
          status={status}
          reset={<ResetPrompt reset={reset} difficulties={[...difficulties]} />}
        >
          <FlagButton />
          <HintButton />
        </Footer>
        {status === 'finished' && isSolved(grid, bombs, flags) && (
          <LeaderboardDialog delay>
            <Leaderboard />
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
      <ResetSetup
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
