import { DialogDescription } from '@radix-ui/react-dialog';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import ControlButton from '@/components/ControlButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatTime } from '@/lib/utils';
import { isSolved } from '../../minesweeperLib';
import { useMinesweeperState } from '../../minesweeperState';
import { Difficulty, LeaderboardEntry } from '../../minesweeperTypes';

const LeaderboardButton: React.FC = () => {
  const { seed, isActive, bombs, flags } = useMinesweeperState();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(
    JSON.parse(
      localStorage.getItem('minesweeper-leaderboard') ?? '[]',
    ) as LeaderboardEntry[],
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>('easy');

  useEffect(() => {
    if (!isActive && isSolved(bombs, flags)) {
      setLeaderboard(
        JSON.parse(
          localStorage.getItem('minesweeper-leaderboard') ?? '[]',
        ) as LeaderboardEntry[],
      );
      setTimeout(() => setIsLeaderboardOpen(true), 1500);
    }
  }, [isActive, bombs, flags]);

  const changeDifficulty = (direction: 'prev' | 'next') => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const currIndex = difficulties.indexOf(selectedDifficulty);
    const newIndex =
      direction === 'prev' ? (currIndex - 1 + 3) % 3 : (currIndex + 1) % 3;
    setSelectedDifficulty(difficulties[newIndex]);
  };
  const deleteEntry = (index: number) =>
    setLeaderboard((prev) => {
      const newLeaderboard = prev.filter((_, index_) => index_ !== index);
      localStorage.setItem(
        'minesweeper-leaderboard',
        JSON.stringify(newLeaderboard),
      );
      return newLeaderboard;
    });

  return (
    <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isLeaderboardOpen}
          Icon={Trophy}
          onClick={() => setIsLeaderboardOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[90%] border-border [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Leaderboard</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div>
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => changeDifficulty('prev')}
              className="h-10 w-10 rounded-full p-0 hover:bg-secondary"
            >
              <svg
                className="h-5 w-5 rotate-180 fill-none stroke-foreground stroke-2"
                viewBox="0 0 24 24"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
            <span className="flex text-center capitalize">
              {selectedDifficulty}
            </span>
            <Button
              variant="ghost"
              onClick={() => changeDifficulty('next')}
              className="h-10 w-10 rounded-full p-0 hover:bg-secondary"
            >
              <svg
                className="h-5 w-5 fill-none stroke-foreground stroke-2"
                viewBox="0 0 24 24"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
          <div
            className="scrollbar-none mb-4 h-60 touch-pan-y space-y-2 overflow-y-auto"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {leaderboard
              .filter((entry) => entry.difficulty === selectedDifficulty)
              .map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between border bg-background p-2 ${entry.seed === seed ? 'border-primary' : 'border-border'} rounded`}
                >
                  <span>{formatTime(entry.time)}</span>
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <Button
                    variant="ghost"
                    onClick={() => deleteEntry(index)}
                    className="h-8 w-8 rounded-full p-0 hover:bg-secondary"
                  >
                    <svg
                      className="h-4 w-4 fill-none stroke-foreground stroke-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </Button>
                </div>
              ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full border border-border hover:bg-secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardButton;
