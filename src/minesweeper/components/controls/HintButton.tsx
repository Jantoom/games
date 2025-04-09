import { DialogDescription } from '@radix-ui/react-dialog';
import { Lightbulb } from 'lucide-react';
import { useState } from 'react';
import ControlButton from '@/components/ControlButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMinesweeperState } from '@/minesweeper/state';
import { getHintCells } from '@/minesweeper/utils';

const HintButton: React.FC = () => {
  const { isActive, grid, bombs, update, setState } = useMinesweeperState();
  const [isHintOpen, setIsHintOpen] = useState(false);

  const getHint = () => {
    const targetCells = getHintCells(grid, bombs);
    if (targetCells.length > 0) {
      const targetCell =
        targetCells[Math.floor(Math.random() * targetCells.length)];
      if (targetCell) {
        setState((prevState) => ({ usedHints: prevState.usedHints + 1 }));
        update(targetCell.row, targetCell.col, false);
      }
    }
  };

  return (
    <Dialog open={isHintOpen} onOpenChange={setIsHintOpen}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isHintOpen}
          Icon={Lightbulb}
          onClick={() => setIsHintOpen(true)}
          disabled={!isActive}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[90%] border-border [&>button:last-child]:hidden">
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
