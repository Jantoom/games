import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Undo } from 'lucide-react';
import { GridHistory, Notes } from '../../types';

export interface UndoButtonHandles {
    getHistory: () => GridHistory[];
    addHistory: (grid: number[][], notes: Notes) => void;
    clearHistory: () => void;
};

interface UndoButtonProps {
    setGrid: React.Dispatch<React.SetStateAction<number[][]>>;
    setNotes: React.Dispatch<React.SetStateAction<Notes>>;
}

export const UndoButton = forwardRef<UndoButtonHandles, UndoButtonProps>(({setGrid, setNotes}, ref) => {
    const [history, setHistory] = useState<GridHistory[]>([]);

    useImperativeHandle(ref, () => ({
        getHistory: () => history,
        addHistory: (grid, notes) =>
            setHistory(prev => [...prev, {
                grid: grid.map(row => [...row]),
                notes: {
                  ...notes
                }
              }]),
        clearHistory: () => setHistory([])
      }));

  const undo = () => {
    const prevState = history[history.length - 1];
    if (prevState) {
      setGrid(prevState.grid.map(row => [...row]));
      setNotes({
        ...prevState.notes
      });
      setHistory(prev => prev.slice(0, -1));
    }
  };

  return (
    <Button
        variant="ghost"
        onClick={undo}
        className="w-[45px] h-[45px] p-0 rounded-full"
      >
        <Undo className="h-5 w-5" />
      </Button>
  );
});
