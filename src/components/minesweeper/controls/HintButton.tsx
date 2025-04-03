import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ControlButton from '../../ControlButton';
import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useMinesweeperState } from '@/states/minesweeperState';
import { getHintCells } from '@/lib/minesweeper';

const HintButton: React.FC = () => {
  const { isActive, grid, bombs, update } = useMinesweeperState();
  const [isHintOpen, setIsHintOpen] = useState(false);

  const close = () => setIsHintOpen(false);
  const getHint = () => {
    const targetCells = getHintCells(grid, bombs);
    if (targetCells.length > 0) {
      const { row, col } =
        targetCells[Math.floor(Math.random() * targetCells.length)];
      update(row, col, false);
    }
  };

  return (
    <Dialog onOpenChange={(isOpen) => (isOpen ? null : close())}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isHintOpen}
          Icon={Lightbulb}
          onClick={() => setIsHintOpen(true)}
          disabled={!isActive}
        />
      </DialogTrigger>
      <DialogContent className="border-border [&>button:last-child]:hidden max-w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Are you sure you want a hint?
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <DialogClose asChild>
          <Button
            onClick={getHint}
            variant="outline"
            className="w-full border border-border hover:bg-secondary"
          >
            Yes
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="outline"
            className="w-full border border-border hover:bg-secondary"
          >
            No
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default HintButton;
