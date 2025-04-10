import { Bomb } from 'lucide-react';
import React, { useEffect } from 'react';
import AnimatedPage from '../components/containers/AnimatedPage';
import Footer from '../components/containers/Footer';
import Header from '../components/containers/Header';
import TimerText from '../components/generics/TimerText';
import FlagButton from '@/minesweeper/components/controls/FlagButton';
import HintButton from '@/minesweeper/components/controls/HintButton';
import Grid from '@/minesweeper/components/game/Grid';
import Settings from '@/minesweeper/components/Settings';
import { useMinesweeperState } from '@/minesweeper/state';
import { isSolved } from '@/minesweeper/utils';

const MinesweeperGame: React.FC = () => {
  const { isActive, bombs, flags, reset, stop, setState } =
    useMinesweeperState();

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (isSolved(bombs, flags)) {
      stop(true);
    }
  }, [bombs, flags, stop]);

  return (
    <AnimatedPage depth={1}>
      <Header settings={<Settings />}>
        <div className="flex h-full w-full justify-center items-center gap-x-2">
          <Bomb className="stroke-foreground" style={{ height: '100%' }} />
          <span className="pb-0.5 text-2xl font-semibold leading-none">
            {Math.max(0, bombs.size - flags.size)}
          </span>
        </div>
        <TimerText
          className="w-full whitespace-nowrap pb-0.5 text-center text-2xl leading-none"
          isActive={isActive}
          set={setState}
        />
      </Header>
      <div className="flex flex-col items-center justify-evenly">
        <Grid />
      </div>
      <Footer>
        <HintButton />
        <FlagButton />
      </Footer>
    </AnimatedPage>
  );
};

export default MinesweeperGame;
