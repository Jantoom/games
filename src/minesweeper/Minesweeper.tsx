import React, { useEffect } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import FlagButton from './components/controls/FlagButton';
import HintButton from './components/controls/HintButton';
import LeaderboardButton from './components/controls/LeaderboardButton';
import OptionsButton from './components/controls/OptionsButton';
import MinesweeperGrid from './components/MinesweeperGrid';
import TimerText from './components/TimerText';
import { isSolved } from './minesweeperLib';
import { useMinesweeperState } from './minesweeperState';
import NavHeader from '@/components/NavHeader';
import BackToMenuButton from '@/components/BackToMenuButton';
import ThemeButton from '@/components/ThemeButton';
import SettingsButton from '@/components/SettingsButton';
import GameHeader from '@/components/GameHeader';
import DifficultyCarousel from '@/components/DifficultyCarousel';
import { difficulties } from './minesweeperTypes';
import GameFooter from '@/components/GameFooter';

const Minesweeper: React.FC = () => {
  const { difficulty, bombs, flags, reset, stop } = useMinesweeperState();

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
          <LeaderboardButton />
          <ThemeButton />
          <SettingsButton />
        </div>
      </NavHeader>
      <GameHeader>
        <TimerText className="w-2/5 text-center text-2xl" />
        <DifficultyCarousel
          className="h-full w-2/5"
          difficulty={difficulty}
          difficulties={[...difficulties]}
          reset={reset}
        />
      </GameHeader>
      <div className="flex h-full w-full flex-col items-center justify-evenly">
        <MinesweeperGrid />
      </div>
      <GameFooter>
        <HintButton />
        <FlagButton />
        <OptionsButton />
      </GameFooter>
    </AnimatedPage>
  );
};

export default Minesweeper;
