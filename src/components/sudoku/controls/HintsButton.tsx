import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ControlButton from '../../ControlButton';
import { Lightbulb } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useSudokuState } from '@/states/sudokuState';
import {
  getAutoNotes,
  getConflictCells,
  getHintCells,
  getMismatchCells,
  toCellKeys,
} from '@/lib/sudoku';
import { DialogDescription } from '@radix-ui/react-dialog';

interface HintsButtonProps {
  update: (
    row: number,
    col: number,
    num: number,
    isPencilMode: boolean,
  ) => void;
}

const HintsButton: React.FC<HintsButtonProps> = ({ update }) => {
  const { isActive, solvedGrid, grid, notes, setState } = useSudokuState();
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const errorBlinkerRef = useRef<NodeJS.Timeout | null>(null);

  const showErrorAnimation = useCallback(
    (cells: string[]) => {
      if (errorBlinkerRef.current) {
        setState({ errors: [] });
        clearInterval(errorBlinkerRef.current);
      }
      let count = 0;
      errorBlinkerRef.current = setInterval(() => {
        setState((prevState) => ({
          errors: prevState.errors.length ? [] : cells,
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
      const { row, col } =
        targetCells[Math.floor(Math.random() * targetCells.length)];
      const correctNumber = solvedGrid[row][col];
      update(row, col, correctNumber, false);
    }
  };
  const showMismatches = () =>
    showErrorAnimation(toCellKeys(getConflictCells(grid)));
  const validateGrid = () =>
    showErrorAnimation(toCellKeys(getMismatchCells(grid, solvedGrid)));
  const addAutoNotes = () =>
    setState((prevState) => ({
      notes: { ...prevState.notes, ...getAutoNotes(prevState.grid) },
    }));
  const close = () => setIsHintsOpen(false);

  return (
    <Dialog onOpenChange={(isOpen) => (isOpen ? null : close())}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isHintsOpen}
          Icon={Lightbulb}
          onClick={() => setIsHintsOpen(true)}
          disabled={!isActive}
        />
      </DialogTrigger>
      <DialogContent className="border-border [&>button:last-child]:hidden max-w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-center">Hints</DialogTitle>
        </DialogHeader>
        <DialogDescription />
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
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full border border-border hover:bg-secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HintsButton;
