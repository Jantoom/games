import { Lightbulb } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import DialogButton from '@/components/generics/DialogButton';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useSudokuState } from '@/sudoku/state';
import {
  getAutoNotes,
  getConflictCells,
  getHintCells,
  getMismatchCells,
  toCellKeys,
} from '@/sudoku/utils';

const HintsButton: React.FC = () => {
  const { status, solvedGrid, grid, notes, update, setState } =
    useSudokuState();
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const errorBlinkerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const showErrorAnimation = useCallback(
    (cells: string[]) => {
      if (errorBlinkerRef.current) {
        setState({ errors: [] });
        clearInterval(errorBlinkerRef.current);
      }
      let count = 0;
      errorBlinkerRef.current = setInterval(() => {
        setState((prev) => ({
          errors: prev.errors.length > 0 ? [] : cells,
        }));
        count++;
        if (count >= 6) clearInterval(errorBlinkerRef.current);
      }, 500);
    },
    [setState],
  );

  const getHint = () => {
    const targetCells = getHintCells(grid, notes, solvedGrid);
    if (targetCells.length > 0) {
      const targetCell =
        targetCells[Math.floor(Math.random() * targetCells.length)];
      if (targetCell) {
        update(
          targetCell.row,
          targetCell.col,
          solvedGrid[targetCell.row][targetCell.col],
          false,
        );
      }
    }
  };
  const showMismatches = () =>
    showErrorAnimation(toCellKeys(getConflictCells(grid)));
  const validateGrid = () =>
    showErrorAnimation(toCellKeys(getMismatchCells(grid, solvedGrid)));
  const addAutoNotes = () =>
    setState((prev) => ({
      notes: { ...prev.notes, ...getAutoNotes(prev.grid) },
    }));

  return (
    <DialogButton
      Icon={Lightbulb}
      title="Hints"
      isOpen={isHintsOpen}
      setIsOpen={setIsHintsOpen}
      disabled={status !== 'play'}
    >
      <DialogClose asChild>
        <Button
          onClick={getHint}
          variant="outline"
          className="w-full border border-border hover:bg-secondary"
        >
          Get Hint
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button
          onClick={showMismatches}
          variant="outline"
          className="w-full border border-border hover:bg-secondary"
        >
          Show Mismatches
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button
          onClick={validateGrid}
          variant="outline"
          className="w-full border border-border hover:bg-secondary"
        >
          Validate Grid
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button
          onClick={addAutoNotes}
          variant="outline"
          className="w-full border border-border hover:bg-secondary"
        >
          Add Auto Notes
        </Button>
      </DialogClose>
    </DialogButton>
  );
};

export default HintsButton;
