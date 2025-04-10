import { Eraser } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSudokuState } from '@/sudoku/state';
import { getMatchingCells } from '@/sudoku/utils';

const NumberButtons: React.FC = () => {
  const { isActive, grid, selectedNumber, optAssistRemainingCounts, setState } =
    useSudokuState();

  useEffect(() => {
    if (optAssistRemainingCounts) setState({ usedRemainingCounts: true });
  }, [optAssistRemainingCounts, setState]);

  return (
    <div className="grid max-w-full grid-cols-5 grid-rows-2 justify-items-center gap-2">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
        const isSelected = selectedNumber === num;
        const remainingCount = Math.max(
          9 - getMatchingCells(grid, num).length,
          0,
        );
        return (
          <Button
            key={num}
            variant="outline"
            onClick={() =>
              setState((prevState) => ({
                selectedNumber:
                  isActive && prevState.selectedNumber !== num
                    ? num
                    : undefined,
              }))
            }
            className={`relative aspect-square h-[6svh] max-h-full w-[6svh] max-w-full rounded-full py-0 hover:bg-secondary ${isSelected ? 'bg-primary text-background' : ''}`}
          >
            {num ? (
              <>
                <span className="text-[2.5svh] font-medium leading-none">
                  {num}
                </span>
                <span className="absolute pt-[4svh] text-[1.25svh] font-medium">
                  {(optAssistRemainingCounts && remainingCount) || ''}
                </span>
              </>
            ) : (
              <Eraser className="h-1/2" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default NumberButtons;
