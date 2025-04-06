import React, { useEffect } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import FlagButton from './components/controls/FlagButton';
import HintButton from './components/controls/HintButton';
import LeaderboardButton from './components/controls/LeaderboardButton';
import OptionsButton from './components/controls/OptionsButton';
import DifficultyButtons from './components/DifficultyButtons';
import MinesweeperGrid from './components/MinesweeperGrid';
import TimerText from './components/TimerText';
import { isSolved } from './minesweeperLib';
import { useMinesweeperState } from './minesweeperState';

const Minesweeper: React.FC = () => {
  const { seed, bombs, flags, reset, stop } = useMinesweeperState();

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (isSolved(bombs, flags)) {
      stop(true);
    }
  }, [bombs, flags, stop]);

  return (
    <AnimatedPage>
      <div key={seed} className="flex h-svh flex-col items-center py-8">
        <div className="flex h-full flex-col items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <TimerText />
            <DifficultyButtons reset={reset} />
          </div>
          <MinesweeperGrid />
          <div className="flex w-full justify-evenly">
            <HintButton />
            <FlagButton />
            <LeaderboardButton />
            <OptionsButton />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Minesweeper;
