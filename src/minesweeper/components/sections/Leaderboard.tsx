import React, { useState } from 'react';
import { useMinesweeperStore } from '@/minesweeper/state';
import { difficulties } from '@/minesweeper/types';
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
  const { seed, difficulty, leaderboard, setState } = useMinesweeperStore();
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
            .map((entry, index) => (
              <LeaderboardTableRow
                key={index}
                index={index}
                game="minesweeper"
                setState={setState}
                data={[
                  `${index + 1}. ${formatDate(entry.date)}`,
                  formatTime(entry.time),
                ]}
                isCurrent={seed === entry.seed}
                allowDeletion={allowDeletion}
              />
            ))}
        </LeaderboardTableBody>
      </LeaderboardTable>
    </LeaderboardSelector>
  );
};

export default Leaderboard;
