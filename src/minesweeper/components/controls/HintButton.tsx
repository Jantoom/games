import { Lightbulb } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useMinesweeperState } from '@/minesweeper/state';
import { getHintCells } from '@/minesweeper/utils';
import DialogButton from '@/components/generics/DialogButton';

const HintButton: React.FC = () => {
  const { status, grid, bombs, update, setState } = useMinesweeperState();
  const [isHintOpen, setIsHintOpen] = useState(false);

  const getHint = () => {
    const targetCells = getHintCells(grid, bombs);
    if (targetCells.length > 0) {
      const targetCell =
        targetCells[Math.floor(Math.random() * targetCells.length)];
      if (targetCell) {
        setState((prev) => ({ usedHints: prev.usedHints + 1 }));
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
    </DialogButton>
  );
};

export default HintButton;
