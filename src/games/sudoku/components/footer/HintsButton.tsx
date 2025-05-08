import { Lightbulb } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import DialogButton from '@/components/generics/DialogButton';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useSudokuStore } from '@/games/sudoku/state';
import {
  getAutoNotes,
  getConflictCells,
  getHintCells,
  getMismatchCells,
  toCellKeys,
} from '@/games/sudoku/utils';

const HintsButton: React.FC = () => {
  const { status, solvedGrid, grid, notes, update, setState } =
    useSudokuStore();
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
        setState((prev) => ({ usedHints: prev.usedHints || true }));
        update(
          targetCell.row,
          targetCell.col,
          solvedGrid[targetCell.row][targetCell.col],
          false,
        );
      }
    }
  };
  const showMismatches = () => {
    setState((prev) => ({ usedHints: prev.usedHints || true }));
    showErrorAnimation(toCellKeys(getConflictCells(grid)));
  };
  const validateGrid = () => {
    setState((prev) => ({ usedHints: prev.usedHints || true }));
    showErrorAnimation(toCellKeys(getMismatchCells(grid, solvedGrid)));
  };
  const addAutoNotes = () =>
    setState((prev) => ({
      usedHints: prev.usedHints || true,
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
        <Button onClick={getHint} variant="outline">
          Get Hint
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button onClick={showMismatches} variant="outline">
          Show Mismatches
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button onClick={validateGrid} variant="outline">
          Validate Grid
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button onClick={addAutoNotes} variant="outline">
          Add Auto Notes
        </Button>
      </DialogClose>
    </DialogButton>
  );
};

export default HintsButton;
