import { Label } from '@/components/ui/label';
import { useMinesweeperState } from '@/minesweeper/state';
import { Bomb } from 'lucide-react';

const BombCounter: React.FC = () => {
  const { bombs, flags } = useMinesweeperState();
  return (
    <div className="flex w-full items-center justify-center gap-x-2">
      <Bomb className="h-1/2 stroke-foreground" />
      <Label className="pb-0.5 text-2xl font-semibold leading-none">
        {Math.max(0, bombs.size - flags.size)}
      </Label>
    </div>
  );
};

export default BombCounter;
