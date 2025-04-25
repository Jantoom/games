import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/containers/Page';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import ThemeButton from '@/components/elements/ThemeButton';
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
import ResetButton from './components/footer/ResetButton';
import Leaderboard from './components/sections/Leaderboard';
import {
  LeaderboardButton,
  LeaderboardDialog,
} from '@/components/generics/Leaderboard';

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
      <Header title="Minesweeper" back="menu" />
      <Body variant="create">
        <ResetSetup
          status={status}
          reset={reset}
          difficulty={difficulty}
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
        <Header title="Minesweeper" back="create" settings={<Settings />}>
          {optShowRemainingBombs && <BombCounter />}
          {optShowTime && <TimerText init={time} status={status} tick={tick} />}
        </Header>
        <Body variant="play">
          <Grid />
        </Body>
        <Footer
          status={status}
          reset={<ResetPrompt reset={reset} difficulties={[...difficulties]} />}
        >
          <ResetButton />
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

export { MinesweeperCreate, MinesweeperPlay };
