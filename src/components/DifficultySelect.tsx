import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';

export interface DifficultySelectProps<T extends string> {
  difficulty: T;
  difficulties: T[];
  reset: (difficulty: T) => void;
}

const DifficultySelect = <T extends string>({
  difficulty,
  difficulties,
  reset,
}: DifficultySelectProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[75%] rounded-2xl justify-self-end border-secondary"
        >
          <span className="w-full text-center text-base font-semibold">
            {difficulty[0].toUpperCase() + difficulty.slice(1)}
          </span>
          <ChevronDown className="-mx-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-primary bg-background rounded-2xl">
        <DropdownMenuGroup>
          {difficulties.map((diff) => (
            <DropdownMenuItem
              key={diff}
              className="justify-center text-base"
              onClick={() => reset(diff)}
            >
              {diff[0].toUpperCase() + diff.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DifficultySelect;
