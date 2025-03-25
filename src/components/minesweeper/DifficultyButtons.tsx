import { Button } from '@/components/ui/button';
import { Difficulty } from '../../lib/minesweeperTypes';
import React from 'react';
import { useMinesweeperState } from '@/states/minesweeperState';

interface DifficultyButtonsProps {
  reset: (difficulty: Difficulty) => void;
}

const DifficultyButtons: React.FC<DifficultyButtonsProps> = ({ reset }) => {
  const { difficulty } = useMinesweeperState();

  return (
    <div className="flex justify-between w-[50%] min-w-[200px]">
      {(['easy', 'medium', 'hard'] as const).map((diff) => (
        <Button
          key={diff}
          onClick={() => reset(diff)}
          variant="outline"
          className={`w-[32%] rounded-full border-border hover:bg-secondary ${difficulty === diff ? 'bg-primary text-background' : ''}`}
        >
          {diff.charAt(0).toUpperCase() + diff.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default DifficultyButtons;
