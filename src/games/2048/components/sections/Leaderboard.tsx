import React, { useState } from 'react';
import DifficultyCarousel from '@/components/elements/DifficultyCarousel';
import {
  LeaderboardTable,
  LeaderboardTableRow,
} from '@/components/generics/Leaderboard';
import { use2048Store } from '@/games/2048/state';
import { difficulties } from '@/games/2048/types';
import { formatDate } from '@/lib/utils';

interface LeaderboardProps {
  allowDeletion?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ allowDeletion }) => {
  const { seed, difficulty, leaderboard, setState } = use2048Store();
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);

  const tableKey = `${selectedDifficulty}`;

  return (
    <>
      <DifficultyCarousel
        difficulties={[...difficulties]}
        difficulty={difficulty}
        setDifficulty={setSelectedDifficulty}
      />
      <LeaderboardTable tableKey={tableKey} allowDeletion={allowDeletion}>
        {leaderboard
          .filter((entry) => entry.difficulty === selectedDifficulty)
          .map((entry, index) => {
            const isCurrent = seed === entry.seed;
            return (
              <LeaderboardTableRow
                key={index}
                index={index}
                game="2048"
                setState={setState}
                data={[formatDate(entry.date), entry.score]}
                isCurrent={isCurrent}
                allowDeletion={allowDeletion}
              />
            );
          })}
      </LeaderboardTable>
    </>
  );
};

export default Leaderboard;
