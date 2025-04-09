import { Bomb } from 'lucide-react';
import React, { useEffect } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import BackToMenuButton from '@/components/BackToMenuButton';
import DifficultyCarousel from '@/components/DifficultyCarousel';
import GameFooter from '@/components/GameFooter';
import GameHeader from '@/components/GameHeader';
import LeaderboardButton from '@/components/LeaderboardButton';
import NavHeader from '@/components/NavHeader';
import ThemeButton from '@/components/ThemeButton';
import TimerText from '@/components/TimerText';
import FlagButton from '@/minesweeper/components/controls/FlagButton';
import HintButton from '@/minesweeper/components/controls/HintButton';
import SettingsButton from '@/minesweeper/components/controls/SettingsButton';
import Grid from '@/minesweeper/components/game/Grid';
import { useMinesweeperState } from '@/minesweeper/state';
import { difficulties } from '@/minesweeper/types';
import { isSolved } from '@/minesweeper/utils';

const Minesweeper: React.FC = () => {
  const { seed, isActive, difficulty, bombs, flags, reset, stop, setState } =
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
      <NavHeader>
        <BackToMenuButton />
        <div className="flex h-full w-full justify-end">
          <LeaderboardButton
            game="minesweeper"
            shouldOpen={isActive && isSolved(bombs, flags)}
            seed={`${seed}`}
            difficulty={difficulty}
            difficulties={[...difficulties]}
          />
          <ThemeButton />
          <SettingsButton />
        </div>
      </NavHeader>
      <GameHeader>
        <TimerText
          className="w-full text-center text-2xl"
          isActive={isActive}
          set={setState}
        />
        <div className="flex w-full items-center justify-center gap-x-1">
          <Bomb />
          <span className="pb-0.5 text-center text-2xl font-semibold">
            {Math.max(0, bombs.size - flags.size)}
          </span>
        </div>
        <DifficultyCarousel
          className="h-full w-full"
          difficulty={difficulty}
          difficulties={[...difficulties]}
          reset={reset}
        />
      </GameHeader>
      <div className="flex h-full w-full flex-col items-center justify-evenly">
        <Grid />
      </div>
      <GameFooter>
        <HintButton />
        <FlagButton />
      </GameFooter>
    </AnimatedPage>
  );
};

export default Minesweeper;
