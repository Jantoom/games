import React, { useState } from 'react';
import DifficultyCarousel from '@/components/elements/DifficultyCarousel';
import {
  LeaderboardAssists,
  LeaderboardHints,
  LeaderboardTable,
  LeaderboardTableRow,
} from '@/components/generics/Leaderboard';
import { useSudokuStore } from '@/games/sudoku/state';
import { difficulties } from '@/games/sudoku/types';
import { formatDate, formatTime } from '@/lib/utils';

interface LeaderboardProps {
  allowDeletion?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ allowDeletion }) => {
  const {
    seed,
    difficulty,
    optAssistHighlight,
    optAssistRemaining,
    optAssistAutoRemove,
    usedHints,
    leaderboard,
    setState,
  } = useSudokuStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [selectedUsedAssists, setSelectedUsedAssists] = useState([
    optAssistHighlight,
    optAssistRemaining,
    optAssistAutoRemove,
  ]);
  const [selectedUsedHints, setSelectedUsedHints] = useState(usedHints);

  const tableKey = `${selectedDifficulty}${selectedUsedAssists}${selectedUsedHints}`;

  return (
    <>
      <DifficultyCarousel
        difficulties={[...difficulties]}
        difficulty={difficulty}
        setDifficulty={setSelectedDifficulty}
      />
      <div className="flex w-full">
        <LeaderboardAssists
          usedAssists={selectedUsedAssists}
          setUsedAssists={setSelectedUsedAssists}
        />
        <LeaderboardHints
          usedHints={selectedUsedHints}
          setUsedHints={setSelectedUsedHints}
        />
      </div>
      <LeaderboardTable tableKey={tableKey} allowDeletion={allowDeletion}>
        {leaderboard
          .filter(
            (entry) =>
              entry.difficulty === selectedDifficulty &&
              entry.usedAssists.every(
                (usedAssist, index) => usedAssist == selectedUsedAssists[index],
              ) &&
              entry.usedHints === selectedUsedHints,
          )
          .map((entry, index) => {
            const isCurrent = seed === entry.seed;
            return (
              <LeaderboardTableRow
                key={index}
                index={index}
                game="sudoku"
                setState={setState}
                data={[formatDate(entry.date), formatTime(entry.time)]}
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
