import React, { useState } from 'react';
import DifficultyCarousel from '@/components/elements/DifficultyCarousel';
import {
  LeaderboardHints,
  LeaderboardTable,
  LeaderboardTableRow,
} from '@/components/generics/Leaderboard';
import { useMinesweeperStore } from '@/games/minesweeper/state';
import { difficulties } from '@/games/minesweeper/types';
import { formatDate, formatTime } from '@/lib/utils';

interface LeaderboardProps {
  allowDeletion?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ allowDeletion }) => {
  const { seed, difficulty, usedHints, leaderboard, setState } =
    useMinesweeperStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [selectedUsedHints, setSelectedUsedHints] = useState(usedHints);

  const tableKey = `${selectedDifficulty}${selectedUsedHints}`;

  return (
    <>
      <DifficultyCarousel
        difficulties={[...difficulties]}
        difficulty={difficulty}
        setDifficulty={setSelectedDifficulty}
      />
      <LeaderboardHints
        usedHints={selectedUsedHints}
        setUsedHints={setSelectedUsedHints}
      />
      <LeaderboardTable tableKey={tableKey} allowDeletion={allowDeletion}>
        {leaderboard
          .filter(
            (entry) =>
              entry.difficulty === selectedDifficulty &&
              entry.usedHints === selectedUsedHints,
          )
          .map((entry, index) => (
            <LeaderboardTableRow
              key={index}
              index={index}
              game="minesweeper"
              setState={setState}
              data={[
                formatDate(entry.date),
                formatTime(entry.time),
              ]}
              isCurrent={seed === entry.seed}
              allowDeletion={allowDeletion}
            />
          ))}
      </LeaderboardTable>
    </>
  );
};

export default Leaderboard;
