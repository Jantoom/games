import React from 'react';
import { useMinesweeperStore } from '@/minesweeper/state';
import { difficulties } from '@/minesweeper/types';
import {
  LeaderboardCarousel,
  LeaderboardCarouselItem,
  LeaderboardTable,
  LeaderboardTableBody,
  LeaderboardTableRow,
} from '@/components/generics/Leaderboard';
import { formatDate, formatTime } from '@/lib/utils';

const Leaderboard: React.FC = () => {
  const { seed, difficulty, leaderboard, setState } = useMinesweeperStore();

  return (
    <LeaderboardCarousel
      difficulty={difficulty}
      difficulties={[...difficulties]}
    >
      {difficulties.map((diff, index) => (
        <LeaderboardCarouselItem key={index} difficulty={diff}>
          <LeaderboardTable>
            {/* <LeaderboardTableHeader headers={['Date', 'Time']} /> */}
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
                      `${index + 1}. ${formatDate(entry.date)}`,
                      formatTime(entry.time),
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

export default Leaderboard;
