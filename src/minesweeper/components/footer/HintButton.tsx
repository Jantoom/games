import { Lightbulb } from 'lucide-react';
import { useState } from 'react';
import DialogButton from '@/components/generics/DialogButton';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useMinesweeperStore } from '@/minesweeper/state';
import { getHintCells } from '@/minesweeper/utils';

const HintButton: React.FC = () => {
  const { status, grid, bombs, update, setState } = useMinesweeperStore();
  const [isHintOpen, setIsHintOpen] = useState(false);

  const getHint = () => {
    const targetCells = getHintCells(grid, bombs);
    if (targetCells.length > 0) {
      const targetCell =
        targetCells[Math.floor(Math.random() * targetCells.length)];
      if (targetCell) {
        setState((prev) => ({ usedHints: prev.usedHints || true }));
        update(targetCell.row, targetCell.col, false);
      }
    }
  };

  return (
    <DialogButton
      Icon={Lightbulb}
      title="Are you sure you want a hint?"
      isOpen={isHintOpen}
      setIsOpen={setIsHintOpen}
      disabled={status !== 'play'}
    >
      <DialogClose asChild>
        <Button onClick={getHint} variant="outline">
          Yes
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button variant="outline">No</Button>
      </DialogClose>
    </DialogButton>
  );
};

export default HintButton;
