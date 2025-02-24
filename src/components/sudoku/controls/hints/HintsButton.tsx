import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { HintsModal } from './HintsModal';
import { Notes } from '../../types';
import { isValidPlacement } from '@/lib/sudoku';
import { Lightbulb } from 'lucide-react';

export interface HintsButtonHandles {
    clearHints: () => void;
};

interface HintsButtonProps {
    originalGrid: number[][];
    grid: number[][];
    notes: Notes;
    setIsPencilMode: React.Dispatch<React.SetStateAction<boolean>>;
    setNotes: React.Dispatch<React.SetStateAction<Notes>>;
    callUpdate: (row: number, col: number, number: number) => void;
}

export const HintsButton = forwardRef<HintsButtonHandles, HintsButtonProps>(({originalGrid, grid, notes, setIsPencilMode, setNotes, callUpdate}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({
          clearHints: () => setIsModalOpen(false)
        }));

    const giveHint = () => {
      const emptyCells: [number, number][] = [];
      const noteCells: [number, number][] = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            if (notes[`${row}-${col}`]) {
              noteCells.push([row, col]);
            } else {
              emptyCells.push([row, col]);
            }
          }
        }
      }
      const targetCells = emptyCells.length > 0 ? emptyCells : noteCells;
      if (targetCells.length > 0) {
        const [row, col] = targetCells[Math.floor(Math.random() * targetCells.length)];
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            setIsPencilMode(false);
            callUpdate(row, col, num);
            break;
          }
        }
      }
      setIsModalOpen(false);
    };
    const showMismatches = () => {
      const mismatchCells: string[] = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] !== 0) {
            // Check row
            for (let x = 0; x < 9; x++) {
              if (x !== col && grid[row][x] === grid[row][col]) {
                mismatchCells.push(`${row}-${col}`);
                mismatchCells.push(`${row}-${x}`);
              }
            }
            // Check column
            for (let y = 0; y < 9; y++) {
              if (y !== row && grid[y][col] === grid[row][col]) {
                mismatchCells.push(`${row}-${col}`);
                mismatchCells.push(`${y}-${col}`);
              }
            }
            // Check box
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                const y = boxRow + i;
                const x = boxCol + j;
                if (y !== row && x !== col && grid[y][x] === grid[row][col]) {
                  mismatchCells.push(`${row}-${col}`);
                  mismatchCells.push(`${y}-${x}`);
                }
              }
            }
          }
        }
      }
      showErrorAnimation([...new Set(mismatchCells)]);
      setIsModalOpen(false);
    };
    const validateGrid = () => {
      const incorrectCells: string[] = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] !== 0 && originalGrid[row][col] === 0) {
            const temp = grid[row][col];
            grid[row][col] = 0;
            if (!isValidPlacement(grid, row, col, temp)) {
              incorrectCells.push(`${row}-${col}`);
            }
            grid[row][col] = temp;
          }
        }
      }
      showErrorAnimation(incorrectCells);
      setIsModalOpen(false);
    };
    const addAutoNotes = () => {
      const newNotes: Notes = {};
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            const possibleNumbers = new Set<number>();
            for (let num = 1; num <= 9; num++) {
              if (isValidPlacement(grid, row, col, num)) {
                possibleNumbers.add(num);
              }
            }
            if (possibleNumbers.size > 0) {
              newNotes[`${row}-${col}`] = possibleNumbers;
            }
          }
        }
      }
      setNotes(newNotes);
      setIsModalOpen(false);
      setIsPencilMode(false);
    };
    const showErrorAnimation = (cells: string[]) => {
        cells.forEach(pos => {
          const errorCircle = document.querySelector(`[data-error="${pos}"]`);
          if (errorCircle) {
            errorCircle.classList.remove('hidden');
            let count = 0;
            const animate = () => {
              if (count >= 3) {
                errorCircle.classList.add('hidden');
                return;
              }
              errorCircle.classList.remove('opacity-0');
              setTimeout(() => {
                errorCircle.classList.add('opacity-0');
                setTimeout(() => {
                  count++;
                  animate();
                }, 200);
              }, 200);
            };
            animate();
          }
        });
      };

  return (
    <>
    
      <Button
        variant="ghost"
        onClick={() => setIsModalOpen(true)}
        className="w-[45px] h-[45px] p-0 rounded-full"
      >
        <Lightbulb className="h-5 w-5" />
      </Button>

        <HintsModal isModalOpen={isModalOpen} giveHint={giveHint} showMismatches={showMismatches} validateGrid={validateGrid} addAutoNotes={addAutoNotes} onClose={() => setIsModalOpen(false)}/>
      </>
  );
});
