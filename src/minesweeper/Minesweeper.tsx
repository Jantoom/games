import { Bomb } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/containers/AnimatedPage';
import Body from '@/components/containers/Body';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import LeaderboardButton from '@/components/elements/LeaderboardButton';
import ThemeButton from '@/components/elements/ThemeButton';
import { ResetDialog, ResetSetup } from '@/components/generics/Reset';
import TimerText from '@/components/generics/TimerText';
import { Label } from '@/components/ui/label';
import { PageDepth } from '@/lib/types';
import FlagButton from '@/minesweeper/components/controls/FlagButton';
import HintButton from '@/minesweeper/components/controls/HintButton';
import Grid from '@/minesweeper/components/game/Grid';
import Settings from '@/minesweeper/components/Settings';
import { useMinesweeperState } from '@/minesweeper/state';
import { isSolved } from '@/minesweeper/utils';
import { difficulties } from './types';

const MinesweeperCreate: React.FC = () => {
  const { status, read, reset } = useMinesweeperState();

  return (
    <AnimatedPage pageDepth={PageDepth.Create}>
      <Header back="menu" />
      <Body variant="setup">
        <ResetSetup
          status={status}
          read={read}
          reset={reset}
          difficulties={[...difficulties]}
        />
        <Settings />
      </Body>
      <Footer>
        <LeaderboardButton
          game="minesweeper"
          difficulties={[...difficulties]}
        />
        <ThemeButton />
      </Footer>
    </AnimatedPage>
  );
};

const MinesweeperPlay: React.FC = () => {
  const {
    status,
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
    if (status === 'setup') {
      const saveData = read();
      if (!saveData?.status || saveData.status === 'setup') {
        navigate('/games/minesweeper/create');
      } else {
        reset(undefined, saveData);
      }
    } else if (status === 'play' && isSolved(bombs, flags)) {
      stop(true);
    }
  }, [status, bombs, flags, read, reset, stop, navigate]);

  return (
    status !== 'setup' && (
      <AnimatedPage pageDepth={PageDepth.Play} save={save}>
        <Header back="create" settings={<Settings />}>
          {optShowRemainingBombs && (
            <div className="flex w-full items-center justify-center gap-x-2">
              <Bomb className="h-1/2 stroke-foreground" />
              <Label className="pb-0.5 text-2xl font-semibold leading-none">
                {Math.max(0, bombs.size - flags.size)}
              </Label>
            </div>
          )}
          {optShowTime && (
            <TimerText initial={time} active={status === 'play'} tick={tick} />
          )}
        </Header>
        <Body variant="play">
          <Grid />
        </Body>
        <Footer reset={<ResetDialog reset={reset} />}>
          <HintButton />
          <FlagButton />
        </Footer>
      </AnimatedPage>
    )
  );
};

export { MinesweeperCreate, MinesweeperPlay };
