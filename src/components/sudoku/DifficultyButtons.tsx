
import { Button } from "@/components/ui/button";
import { Difficulty } from "../../lib/types";
import React from "react";

interface DifficultyButtonsProps {
  difficulty: Difficulty;
  reset: (difficulty: Difficulty) => void;
}

export const DifficultyButtons: React.FC<DifficultyButtonsProps> = ({difficulty, reset}) => {
  return (
  <div className="flex justify-between w-[50%] min-w-[200px]">
    {(['easy', 'medium', 'hard'] as const).map((diff) => (
      <Button
        key={diff}
        onClick={() => reset(diff)}
        variant='outline'
        className={`w-[32%] border-border hover:bg-secondary transition-colors duration-300 ease-in-out ${difficulty === diff ? 'bg-primary text-background' : ''}`}
      >
        {diff.charAt(0).toUpperCase() + diff.slice(1)}
      </Button>
    ))}
  </div>
);
};