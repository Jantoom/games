
import { Button } from "@/components/ui/button";
import { Difficulty } from "./types";

interface DifficultyButtonsProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export const DifficultyButtons: React.FC<DifficultyButtonsProps> = ({
  currentDifficulty,
  onSelectDifficulty,
}) => (
  <div className="flex gap-2">
    {(['easy', 'medium', 'hard'] as const).map((diff) => (
      <Button
        key={diff}
        onClick={() => onSelectDifficulty(diff)}
        variant={currentDifficulty === diff ? 'default' : 'outline'}
        className={
          currentDifficulty === diff
            ? 'bg-primary text-background hover:bg-primary/90'
            : 'border-border text-foreground hover:bg-secondary'
        }
      >
        {diff.charAt(0).toUpperCase() + diff.slice(1)}
      </Button>
    ))}
  </div>
);
