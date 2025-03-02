
import { Button } from "@/components/ui/button";
import { Difficulty } from "../../lib/types";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface DifficultyButtonsHandles {
  getDifficulty: () => Difficulty;
}

interface DifficultyButtonsProps {
  reset: (difficulty: Difficulty) => void;
}

export const DifficultyButtons = forwardRef<DifficultyButtonsHandles, DifficultyButtonsProps>(({reset}, ref) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  useImperativeHandle(ref, () => ({
    getDifficulty: () => difficulty,
  }));

  return (
  <div className="flex justify-between w-[50%] min-w-[200px]">
    {(['easy', 'medium', 'hard'] as const).map((diff) => (
      <Button
        key={diff}
        onClick={() => {
          setDifficulty(diff);
          reset(diff);
        }}
        variant='outline'
        className={`w-[32%] border-border hover:bg-secondary transition-colors duration-300 ease-in-out ${difficulty === diff ? 'bg-primary text-background' : ''}`}
      >
        {diff.charAt(0).toUpperCase() + diff.slice(1)}
      </Button>
    ))}
  </div>
);
});