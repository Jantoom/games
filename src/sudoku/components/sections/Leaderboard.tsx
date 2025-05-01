import React, { useState } from 'react';
import { useSudokuStore } from '@/sudoku/state';
import { difficulties } from '@/sudoku/types';
import {
  LeaderboardSelector,
  LeaderboardTable,
  LeaderboardTableBody,
  LeaderboardTableRow,
} from '@/components/generics/Leaderboard';
import { formatDate, formatTime } from '@/lib/utils';

interface LeaderboardProps {
  allowDeletion?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ allowDeletion }) => {
  const { seed, difficulty, leaderboard, setState } = useSudokuStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);

  return (
    <LeaderboardSelector
      difficulties={[...difficulties]}
      difficulty={selectedDifficulty}
      setDifficulty={setSelectedDifficulty}
    >
      <LeaderboardTable>
        <LeaderboardTableBody>
          {leaderboard
            .filter((entry) => entry.difficulty === selectedDifficulty)
            .map((entry, index) => {
              const isCurrent = seed === entry.seed;
              return (
                <LeaderboardTableRow
                  key={index}
                  index={index}
                  game="sudoku"
                  setState={setState}
                  data={[
                    formatDate(entry.date),
                    formatTime(entry.time),
                    // <div className="flex w-full items-center justify-center gap-2">
                    //   {entry.hints.map((hint, index) => (
                    //     <div
                    //       key={index}
                    //       className={`h-4 w-4 rounded-full ${hint ? (isCurrent ? 'bg-primary' : 'bg-foreground') : isCurrent ? 'border border-primary' : 'border border-foreground'}`}
                    //     />
                    //   ))}
                    // </div>,
                  ]}
                  isCurrent={isCurrent}
                  allowDeletion={allowDeletion}
                />
              );
            })}
        </LeaderboardTableBody>
      </LeaderboardTable>
    </LeaderboardSelector>
  );
};

export default Leaderboard;
