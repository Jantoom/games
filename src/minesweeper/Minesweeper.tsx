import { Bomb } from 'lucide-react';
import React, { useEffect } from 'react';
import AnimatedPage from '@/components/containers/AnimatedPage';
import Footer from '@/components/containers/Footer';
import Header from '@/components/containers/Header';
import TimerText from '@/components/generics/TimerText';
import FlagButton from '@/minesweeper/components/controls/FlagButton';
import HintButton from '@/minesweeper/components/controls/HintButton';
import Grid from '@/minesweeper/components/game/Grid';
import Settings from '@/minesweeper/components/Settings';
import { useMinesweeperState } from '@/minesweeper/state';
import { isSolved } from '@/minesweeper/utils';
import Body from '@/components/containers/Body';
import { Label } from '@/components/ui/label';
import Reset from '@/components/generics/Reset';

const MinesweeperGame: React.FC = () => {
  const {
    status,
    bombs,
    flags,
    optShowRemainingBombs,
    optShowTime,
    reset,
    stop,
    tick,
  } = useMinesweeperState();

  useEffect(() => reset(), [reset]);

  useEffect(() => {
    if (status === 'play' && isSolved(bombs, flags)) {
      stop(true);
    }
  }, [status, bombs, flags, stop]);

  return (
    status === 'play' && (
      <AnimatedPage depth={1}>
        <Header settings={<Settings />}>
          {optShowRemainingBombs && (
            <div className="flex w-full items-center justify-center gap-x-2">
              <Bomb className="h-1/2 stroke-foreground" />
              <Label className="pb-0.5 text-2xl font-semibold leading-none">
                {Math.max(0, bombs.size - flags.size)}
              </Label>
            </div>
          )}
          {optShowTime && <TimerText active={status === 'play'} tick={tick} />}
        </Header>
        <Body>
          <Grid />
        </Body>
        <Footer reset={<Reset reset={() => reset()}/>}>
          <HintButton />
          <FlagButton />
        </Footer>
      </AnimatedPage>
    )
  );
};

export default MinesweeperGame;
