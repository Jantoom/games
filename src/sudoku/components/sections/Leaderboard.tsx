import React from 'react';
import { useSudokuState } from '@/sudoku/state';
import { difficulties } from '@/sudoku/types';
import {
  LeaderboardCarousel,
  LeaderboardCarouselItem,
  LeaderboardTable,
  LeaderboardTableBody,
  LeaderboardTableHeader,
  LeaderboardTableRow,
} from '@/components/generics/Leaderboard';

const Leaderboard: React.FC = () => {
  const { seed, difficulty, leaderboard, setState } = useSudokuState();

  return (
    <LeaderboardCarousel
      difficulty={difficulty}
      difficulties={[...difficulties]}
    >
      {difficulties.map((diff, index) => (
        <LeaderboardCarouselItem key={index} difficulty={diff}>
          <LeaderboardTable>
            <LeaderboardTableHeader headers={['Score', 'Hints', 'Date']} />
            <LeaderboardTableBody>
              {leaderboard
                .filter((entry) => entry.difficulty === diff)
                .map((entry, index) => {
                  const isCurrent = seed === entry.seed;
                  return (
                    <LeaderboardTableRow
                      key={index}
                      index={index}
                      game="sudoku"
                      setState={setState}
                      data={[
                        entry.score,
                        <div className="flex w-full items-center justify-center gap-2">
                          {entry.hints.map((hint, index) => (
                            <div
                              key={index}
                              className={`h-4 w-4 rounded-full ${hint ? (isCurrent ? 'bg-primary' : 'bg-foreground') : isCurrent ? 'border border-primary' : 'border border-foreground'}`}
                            />
                          ))}
                        </div>,
                        new Date(entry.date).toLocaleDateString(),
                      ]}
                      isCurrent={isCurrent}
                    />
                  );
                })}
            </LeaderboardTableBody>
          </LeaderboardTable>
        </LeaderboardCarouselItem>
      ))}
    </LeaderboardCarousel>
  );
};

export default Leaderboard;
