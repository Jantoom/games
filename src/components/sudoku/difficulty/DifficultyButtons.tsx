import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { Difficulty } from '../types';

export interface DifficultyButtonsHandles {
    getDifficulty: () => Difficulty;
    setDifficulty: (diff: Difficulty) => void;
};

interface DifficultyButtonsProps {
    callReset: (diff: Difficulty) => void;
}

export const DifficultyButtons = forwardRef<DifficultyButtonsHandles, DifficultyButtonsProps>(({callReset}, ref) => {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  useImperativeHandle(ref, () => ({
            getDifficulty: () => difficulty,
            setDifficulty: (diff) => setDifficulty(diff)
          }));

  return (
    <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map(diff => <Button key={diff} onClick={() => callReset(diff)} variant={difficulty === diff ? 'default' : 'outline'} className={difficulty === diff ? 'bg-primary hover:bg-primary/90' : 'border-game-gridline text-game-gridline hover:bg-game-highlight'}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Button>)}
        </div>
  );
});
