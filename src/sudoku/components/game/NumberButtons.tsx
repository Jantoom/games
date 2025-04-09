import { Eraser } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSudokuState } from '@/sudoku/state';
import { getMatchingCells } from '@/sudoku/utils';

const NumberButtons: React.FC = () => {
  const { isActive, grid, selectedNumber, optRemainingCounts, setState } =
    useSudokuState();

  useEffect(() => {
    if (optRemainingCounts) setState({ usedRemainingCounts: true });
  }, [optRemainingCounts, setState]);

  return (
    <div className="grid w-2/3 grid-cols-5 grid-rows-2 justify-items-center gap-[clamp(min(0.8vh,1.5vw),1.5vw,0.5em)]">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number_) => {
        const isSelected = selectedNumber === number_;
        const remainingCount = Math.max(
          9 - getMatchingCells(grid, number_).length,
          0,
        );
        return (
          <Button
            key={number_}
            variant="outline"
            onClick={() =>
              setState((prevState) => ({
                selectedNumber:
                  (isActive &&
                    prevState.selectedNumber !== number_ &&
                    number_) ||
                  undefined,
              }))
            }
            className={`relative aspect-square h-full w-full rounded-full hover:bg-secondary ${isSelected ? 'bg-primary text-background' : ''}`}
          >
            {number_ ? (
              <>
                <span className="text-[min(5vw,2.5vh)] font-medium">
                  {number_}
                </span>
                <span className="absolute pt-[65%] text-[min(2.5vw,1.25vh)] font-medium">
                  {(optRemainingCounts && remainingCount) || ''}
                </span>
              </>
            ) : (
              <Eraser className="h-full w-full" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default NumberButtons;
