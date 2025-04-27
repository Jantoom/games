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
import { useMinesweeperState } from '@/minesweeper/state';
import { isSolved } from '@/minesweeper/utils';
import { difficulties } from './types';
import BombCounter from './components/header/BombCounter';
import Leaderboard from './components/sections/Leaderboard';
import { LeaderboardDialog } from '@/components/generics/Leaderboard';

const MinesweeperCreate: React.FC = () => {
  const { status, difficulty, read, reset } = useMinesweeperState();

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
        <Settings />
      </Body>
      <Footer />
    </Page>
  );
};

const MinesweeperPlay: React.FC = () => {
  const {
    status,
    seed,
    time,
    bombs,
    flags,
    optShowRemainingBombs,
    optShowTime,
    read,
    save,
    reset,
    stop,
    tick,
  } = useMinesweeperState();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'create') {
      const saveData = read();
      if (!saveData?.status || saveData.status === 'create') {
        navigate('/games/minesweeper/create');
      } else {
        reset(undefined, saveData);
      }
    } else if (status === 'play' && isSolved(bombs, flags)) {
      stop(true);
    }
  }, [status, bombs, flags, read, reset, stop, navigate]);

  return (
    status !== 'create' && (
      <Page seed={seed} save={save}>
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
        {status === 'finished' && isSolved(bombs, flags) && (
          <LeaderboardDialog delay>
            <Leaderboard />
          </LeaderboardDialog>
        )}
      </Page>
    )
  );
};

const MinesweeperSettings: React.FC = () => {
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

const MinesweeperLeaderboard: React.FC = () => {
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

export {
  MinesweeperCreate,
  MinesweeperPlay,
  MinesweeperSettings,
  MinesweeperLeaderboard,
};
