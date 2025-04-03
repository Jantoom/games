import React, { useCallback, useEffect } from 'react';
import AnimatedPage from './AnimatedPage';
import MinesweeperGrid from '@/components/minesweeper/MinesweeperGrid';
import { useMinesweeperState } from '@/states/minesweeperState';
import { isSolved } from '@/lib/minesweeper';
import TimerText from '@/components/minesweeper/TimerText';
import DifficultyButtons from '@/components/minesweeper/DifficultyButtons';
import LeaderboardButton from '@/components/minesweeper/controls/LeaderboardButton';

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
      <div key={seed} className="flex flex-col h-svh items-center py-8">
        <div className="flex flex-col items-center justify-between h-full">
          <div className="flex justify-between items-center w-full">
            <TimerText />
            <DifficultyButtons reset={reset} />
          </div>
          <MinesweeperGrid />
          <div className="flex justify-evenly w-full">
              {/* <PencilButton /> */}
              <LeaderboardButton />
            </div>
          </div>
        </div>
    </AnimatedPage>
  );
};

export default Minesweeper;
