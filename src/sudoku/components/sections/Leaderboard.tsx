import React, { useState } from 'react';
import { useSudokuStore } from '@/sudoku/state';
import { difficulties } from '@/sudoku/types';
import {
  LeaderboardAssists,
  LeaderboardHints,
  LeaderboardTable,
  LeaderboardTableBody,
  LeaderboardTableRow,
} from '@/components/generics/Leaderboard';
import { formatDate, formatTime } from '@/lib/utils';
import DifficultyCarousel from '@/components/elements/DifficultyCarousel';

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
  const [selectedUsedHints, setSelectedUsedHints] = useState(usedHints);
  const [selectedUsedAssists, setSelectedUsedAssists] = useState([
    optAssistHighlight,
    optAssistRemaining,
    optAssistAutoRemove,
  ]);

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
      <LeaderboardTable difficulty={selectedDifficulty}>
        <LeaderboardTableBody>
          {leaderboard
            .filter(
              (entry) =>
                entry.difficulty === selectedDifficulty &&
                entry.usedAssists.every(
                  (usedAssist, index) =>
                    usedAssist == selectedUsedAssists[index],
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
        </LeaderboardTableBody>
      </LeaderboardTable>
    </>
  );
};

export default Leaderboard;
