import { Label } from '@/components/ui/label';
import { useMinesweeperState } from '@/minesweeper/state';
import { Bomb } from 'lucide-react';

const BombCounter: React.FC = () => {
  const { bombs, flags } = useMinesweeperState();
  return (
    <div className="relative flex w-full items-center justify-center gap-x-[0.25rem]">
      <Bomb className="h-[1.25rem] stroke-foreground" />
      <Label className="align-text-top text-xl font-semibold">
        {Math.max(0, bombs.size - flags.size)}
      </Label>
    </div>
  );
};

export default BombCounter;
