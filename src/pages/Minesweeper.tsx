import React, { useEffect } from 'react';
import FlagButton from '@/components/minesweeper/controls/FlagButton';
import HintButton from '@/components/minesweeper/controls/HintButton';
import LeaderboardButton from '@/components/minesweeper/controls/LeaderboardButton';
import OptionsButton from '@/components/minesweeper/controls/OptionsButton';
import DifficultyButtons from '@/components/minesweeper/DifficultyButtons';
import MinesweeperGrid from '@/components/minesweeper/MinesweeperGrid';
import TimerText from '@/components/minesweeper/TimerText';
import { isSolved } from '@/lib/minesweeper';
import { useMinesweeperState } from '@/states/minesweeperState';
import AnimatedPage from './AnimatedPage';

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
