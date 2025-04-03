import React from 'react';
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';
import { getMatchingCells } from '@/lib/sudoku';
import { useSudokuState } from '@/states/sudokuState';

const NumberButtons: React.FC = () => {
  const { isActive, grid, selectedNumber, setState } = useSudokuState();

  return (
    <div className="grid grid-rows-2 grid-cols-5 gap-[clamp(min(0.8vh,1.5vw),1.5vw,0.5em)] justify-items-center w-2/3">
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
                  isActive && prevState.selectedNumber !== num ? num : null,
              }))
            }
            className={`w-full h-full aspect-square relative rounded-full hover:bg-secondary ${isSelected ? 'bg-primary text-background' : ''}`}
          >
            {num ? (
              <>
                <span className="text-[min(5vw,2.5vh)] font-medium">{num}</span>
                <span className="text-[min(2.5vw,1.25vh)] font-medium absolute pt-[65%]">
                  {remainingCount ? remainingCount : ''}
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
