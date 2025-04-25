import React from 'react';
import { useMinesweeperState } from '@/minesweeper/state';
import { difficulties } from '@/minesweeper/types';
import {
  LeaderboardCarousel,
  LeaderboardCarouselItem,
  LeaderboardTable,
  LeaderboardTableBody,
  LeaderboardTableHeader,
  LeaderboardTableRow,
} from '@/components/generics/Leaderboard';

const MinesweeperLeaderboard: React.FC = () => {
  const { seed, difficulty, leaderboard, setState } = useMinesweeperState();

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
                .map((entry, index) => (
                  <LeaderboardTableRow
                    key={index}
                    index={index}
                    game="minesweeper"
                    setState={setState}
                    data={[
                      entry.score,
                      entry.hints,
                      new Date(entry.date).toLocaleDateString(),
                    ]}
                    isCurrent={seed === entry.seed}
                  />
                ))}
            </LeaderboardTableBody>
          </LeaderboardTable>
        </LeaderboardCarouselItem>
      ))}
    </LeaderboardCarousel>
  );
};

export default MinesweeperLeaderboard;
