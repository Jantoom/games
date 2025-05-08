import { Bomb } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useMinesweeperStore } from '@/games/minesweeper/state';

const BombCounter: React.FC = () => {
  const { bombs, flags } = useMinesweeperStore();
  return (
    <div className="relative flex w-fit items-center justify-center gap-x-1">
      <Bomb className="stroke-foreground" />
      <Label className="align-text-top text-xl font-medium">
        {Math.max(0, bombs.size - flags.size)}
      </Label>
    </div>
  );
};

export default BombCounter;
