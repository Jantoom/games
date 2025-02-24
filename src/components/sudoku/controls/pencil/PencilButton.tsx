import React, { useState, useImperativeHandle, forwardRef, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { StickyNote } from 'lucide-react';
import { Notes } from '../../types';

export interface PencilButtonHandles {
    isPencilMode: () => boolean;
    setIsPencilMode: (isPencilMode: boolean) => void;
    getNotes: () => Notes;
    setNotes: (notes: Notes) => void;
    updateNotes: (grid: number[][], setGrid: React.Dispatch<React.SetStateAction<number[][]>>, row: number, col: number, number: number) => void;
    displayCellNotes: (row: number, col: number) => ReactNode;
    clearPencil: () => void;
};

export const PencilButton = forwardRef<PencilButtonHandles>((props, ref) => {
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [notes, setNotes] = useState<Notes>({});

  useImperativeHandle(ref, () => ({
    isPencilMode: () => isPencilMode,
    setIsPencilMode: (isPencilMode) => setIsPencilMode(isPencilMode),
    getNotes: () => notes,
    setNotes: (notes) => setNotes(notes),
    clearPencil: () => {
        setIsPencilMode(false);
        setNotes({});
    },
    updateNotes: (grid, setGrid, row, col, number) => {
        const key = `${row}-${col}`;

        if (isPencilMode) {
            const currentNotes = notes[key] || new Set();
            const newNotes = {
              ...notes
            };
            if (currentNotes.has(number)) {
              currentNotes.delete(number);
            } else {
              currentNotes.add(number);
            }
            if (currentNotes.size > 0) {
              newNotes[key] = currentNotes;
            } else {
              delete newNotes[key];
            }
            setNotes(newNotes);
            const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = -1;
      setGrid(newGrid);
        } else {
            const newNotes = {
                ...notes
            };
            delete newNotes[key];
            setNotes(newNotes);
            const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = number;
      setGrid(newGrid);
        }
    },
    displayCellNotes: (row, col) => {
        const key = `${row}-${col}`;

        return (
        <div className="grid grid-cols-3 gap-[2px] p-1 w-full h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[8px] text-game-pencil"
            >
              {notes[key]?.has(i + 1) ? i + 1 : ''}
            </div>
          ))}
        </div>
      )}
  }));

  return (
    <>
    
    <Button
        variant="ghost"
        onClick={() => setIsPencilMode(!isPencilMode)}
        className={`w-[45px] h-[45px] p-0 ${isPencilMode ? 'bg-blue-100 rounded-full' : 'rounded-full'}`}
      >
        <StickyNote className="h-5 w-5" />
      </Button>

      </>
  );
});
