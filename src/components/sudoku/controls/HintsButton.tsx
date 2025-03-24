import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ControlButton } from "./ControlButton";
import { Lightbulb } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useSudokuState } from "@/states/sudokuState";
import { getAutoNotes, getConflictCells, getHintCells, getMismatchCells, toCellKeys } from "@/lib/sudoku";

interface HintsButtonProps {
  update: (row: number, col: number, num: number, isPencilMode: boolean) => void;
}

export const HintsButton: React.FC<HintsButtonProps> = ({
  update
}) => {
  const { solvedGrid, grid, notes, setState } = useSudokuState();
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const errorBlinkerRef = useRef<NodeJS.Timeout | null>(null);

  const showErrorAnimation = useCallback((cells: string[]) => {
      if (errorBlinkerRef.current) {
        setState({ errors: [] });
        clearInterval(errorBlinkerRef.current);
      }
      let count = 0;
      errorBlinkerRef.current = setInterval(() => {
        setState(prevState => ({ errors: prevState.errors.length ? [] : cells }));
        count++;
        if (count >= 6) clearInterval(errorBlinkerRef.current);
      }, 500);
    }, [setState]);
  
  const onClose = () => setIsHintsOpen(false);
  const onGetHint = () => {
    const targetCells = getHintCells(grid, notes, solvedGrid);
    if (targetCells.length > 0) {
      const {row, col} = targetCells[Math.floor(Math.random() * targetCells.length)];
      const correctNumber = solvedGrid[row][col];
      update(row, col, correctNumber, false);
    }
    onClose();
  };
  const onShowMismatches = () => {
    showErrorAnimation(toCellKeys(getConflictCells(grid)));
    onClose();
  };
  const onValidateGrid = () => {
    showErrorAnimation(toCellKeys(getMismatchCells(grid, solvedGrid)));
    onClose();
  };
  const onAddAutoNotes = () => {
    setState(prevState => ({ notes: {...prevState.notes, ...getAutoNotes(prevState.grid)}}));
    onClose();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ControlButton isSelected={isHintsOpen} Icon={Lightbulb} onClick={() => setIsHintsOpen(true)} />
      </DialogTrigger>
      <DialogContent className="border-border [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Hints</DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <Button onClick={onGetHint} variant="outline" className="w-full border border-border hover:bg-secondary">
            Get Hint
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={onShowMismatches} variant="outline" className="w-full border border-border hover:bg-secondary">
            Show Mismatches
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={onValidateGrid} variant="outline" className="w-full border border-border hover:bg-secondary">
            Validate Grid
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={onAddAutoNotes} variant="outline" className="w-full border border-border hover:bg-secondary">
            Add Auto Notes
          </Button>
        </DialogClose>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClose} variant="outline" className="w-full border border-border hover:bg-secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};