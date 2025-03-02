
import { Button } from "@/components/ui/button";
import { Difficulty } from "../../lib/types";

interface DifficultyButtonsProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export const DifficultyButtons: React.FC<DifficultyButtonsProps> = ({
  currentDifficulty,
  onSelectDifficulty,
}) => (
  <div className="flex justify-between w-[50%] min-w-[200px]">
    {(['easy', 'medium', 'hard'] as const).map((diff) => (
      <Button
        key={diff}
        onClick={() => onSelectDifficulty(diff)}
        variant='outline'
        className={`w-[32%] border-border hover:bg-secondary transition-colors duration-300 ease-in-out ${currentDifficulty === diff ? 'bg-primary text-background' : ''}`}
      >
        {diff.charAt(0).toUpperCase() + diff.slice(1)}
      </Button>
    ))}
  </div>
);
