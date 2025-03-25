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
import ControlButton from './ControlButton';
import { Difficulty, LeaderboardEntry } from '../../../lib/types';
import { formatTime } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useSudokuState } from '@/states/sudokuState';
import { Trophy } from 'lucide-react';

const LeaderboardButton: React.FC = () => {
  const { seed, isActive } = useSudokuState();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(
    JSON.parse(localStorage.getItem('sudoku-leaderboard')) || [],
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>('easy');

  useEffect(() => {
    if (!isActive) {
      setLeaderboard(JSON.parse(localStorage.getItem('sudoku-leaderboard')));
      setIsLeaderboardOpen(true);
    }
  }, [isActive]);

  const close = () => setIsLeaderboardOpen(false);
  const changeDifficulty = (direction: 'prev' | 'next') => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const currentIndex = difficulties.indexOf(selectedDifficulty);
    const newIndex =
      direction === 'prev'
        ? (currentIndex - 1 + 3) % 3
        : (currentIndex + 1) % 3;
    setSelectedDifficulty(difficulties[newIndex]);
  };
  const deleteEntry = (index) =>
    setLeaderboard((prev) => {
      const newLeaderboard = prev.filter((_, i) => i !== index);
      localStorage.setItem(
        'sudoku-leaderboard',
        JSON.stringify(newLeaderboard),
      );
      return newLeaderboard;
    });

  return (
    <Dialog
      open={isLeaderboardOpen}
      onOpenChange={(isOpen) => (isOpen ? null : close())}
    >
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isLeaderboardOpen}
          Icon={Trophy}
          onClick={() => setIsLeaderboardOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="border-border [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Leaderboard</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => changeDifficulty('prev')}
              className="w-10 h-10 p-0 hover:bg-secondary rounded-full"
            >
              <svg
                className="h-5 w-5 rotate-180 fill-none stroke-foreground stroke-2"
                viewBox="0 0 24 24"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
            <span className="flex capitalize text-center">
              {selectedDifficulty}
            </span>
            <Button
              variant="ghost"
              onClick={() => changeDifficulty('next')}
              className="w-10 h-10 p-0 hover:bg-secondary rounded-full"
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
            className="h-60 overflow-y-auto scrollbar-none touch-pan-y space-y-2 mb-4"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {leaderboard
              .filter((entry) => entry.difficulty === selectedDifficulty)
              .map((entry, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-2 bg-background border ${entry.seed === seed ? 'border-primary' : 'border-border'} rounded`}
                >
                  <span>{formatTime(entry.time)}</span>
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <Button
                    variant="ghost"
                    onClick={() => deleteEntry(index)}
                    className="w-8 h-8 p-0 hover:bg-secondary rounded-full"
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
