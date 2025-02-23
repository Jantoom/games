
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateSudoku, isValidPlacement } from "@/lib/sudoku";
import { StickyNote, Eraser } from "lucide-react";

type Mode = 'default' | 'pencil' | 'eraser';
type CellNotes = Set<number>;
type Notes = { [key: string]: CellNotes };
type Difficulty = 'easy' | 'medium' | 'hard';

export const SudokuBoard = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>('default');
  const [notes, setNotes] = useState<Notes>({});
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  useEffect(() => {
    newGame('easy');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const newGame = (newDifficulty: Difficulty) => {
    const newGrid = generateSudoku(newDifficulty);
    setGrid(newGrid.map(row => [...row]));
    setOriginalGrid(newGrid.map(row => [...row]));
    setSelectedCell(null);
    setMode('default');
    setNotes({});
    setTimer(0);
    setIsActive(true);
    setDifficulty(newDifficulty);
  };

  const handleCellClick = (row: number, col: number) => {
    if (mode === 'eraser') {
      if (originalGrid[row][col] !== 0) {
        toast.error("Can't modify original numbers!");
        return;
      }
      const key = `${row}-${col}`;
      setNotes(prevNotes => {
        const newNotes = { ...prevNotes };
        delete newNotes[key];
        return newNotes;
      });
      const newGrid = grid.map(row => [...row]);      
      newGrid[row][col] = 0;
      setGrid(newGrid);
      return;
    }

    if (selectedNumber !== null && originalGrid[row][col] === 0) {
      if (!isValidPlacement(grid, row, col, selectedNumber)) {
        toast.error("Invalid move!");
        return;
      }
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = selectedNumber;
      setGrid(newGrid);

      if (!newGrid.some(row => row.includes(0))) {
        toast.success("Congratulations! You've completed the puzzle!");
        setIsActive(false);
      }
    }
    
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number: number) => {
    if (selectedNumber === number) {
      setSelectedNumber(null);
      return;
    }
    setSelectedNumber(number);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingCount = (number: number) => {
    const totalCount = 9;
    const usedCount = grid.flat().filter(n => n === number).length;
    return totalCount - usedCount;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 bg-slate-100">
      <div className="flex justify-between items-center w-[424px]">
        <span className="text-lg font-medium text-game-gridline">{formatTime(timer)}</span>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <Button
              key={diff}
              onClick={() => newGame(diff)}
              variant={difficulty === diff ? 'default' : 'outline'}
              className={
                difficulty === diff
                  ? 'bg-primary hover:bg-primary/90'
                  : 'border-game-gridline text-game-gridline hover:bg-game-highlight'
              }
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-9 bg-game-gridline gap-[1px] p-[1px] rounded-lg shadow-lg overflow-hidden w-[424px]">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isHighlighted = selectedNumber !== null && cell === selectedNumber;
            const randomDelay = `${Math.random() * 0.2}s`;

            const insetBorders = `
              ${rowIndex === 0 ? '' : 'border-t-[1px] mt-[2px]'}
              ${colIndex === 0 ? '' : 'border-l-[1px] ml-[2px]'}
              ${rowIndex === 8 ? '' : 'border-b-[1px] mb-[2px]'}
              ${colIndex === 8 ? '' : 'border-r-[1px] mr-[2px]'}
            `;

            const blockBorder = `
              ${rowIndex % 3 === 0 ? 'border-t-[1px]' : ''}
              ${colIndex % 3 === 0 ? 'border-l-[1px]' : ''}
              ${rowIndex % 3 === 2 ? 'border-b-[1px]' : ''}
              ${colIndex % 3 === 2 ? 'border-r-[1px]' : ''}
            `;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-[45px] h-[45px] flex items-center justify-center
                  bg-white
                  hover:bg-game-highlight
                  cursor-pointer transition-colors duration-200
                  ${blockBorder}
                  ${insetBorders}
                  border-game-gridline
                  relative
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? (
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className={`
                      absolute inset-0 rounded-full
                      ${originalGrid[rowIndex][colIndex] !== 0 ? 'bg-neutral-100' : ''}
                    `} />
                    {isHighlighted && (
                      <div 
                        className="absolute inset-0 rounded-full bg-blue-100 animate-scale-fade"
                        style={{ animationDelay: randomDelay }}
                      />
                    )}
                    <span className={`
                      relative z-10 text-xl font-medium
                      ${originalGrid[rowIndex][colIndex] !== 0 ? 'text-primary' : 'text-game-gridline'}
                    `}>
                      {cell}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-[2px] p-1 w-full h-full">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center text-[8px] text-game-pencil"
                      >
                        {notes[`${rowIndex}-${colIndex}`]?.has(i + 1) ? i + 1 : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-rows-2 grid-cols-5 gap-3 w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
          const remaining = getRemainingCount(number);
          return (
            <Button
              key={number}
              variant="outline"
              className={`
                w-[50px] h-[50px] p-0 relative rounded-full
                border-game-gridline text-game-gridline 
                hover:bg-game-highlight
                ${selectedNumber === number ? 'bg-blue-100' : 'bg-white'}
              `}
              onClick={() => handleNumberInput(number)}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-medium mb-1">{number}</span>
                {remaining > 0 && (
                  <span className="text-xs absolute bottom-2">{remaining}</span>
                )}
              </div>
            </Button>
          );
        })}
        <Button
          variant="outline"
          onClick={() => setMode(mode === 'eraser' ? 'default' : 'eraser')}
          className={`
            w-[50px] h-[50px] p-0 relative rounded-full
            border-game-gridline text-game-gridline 
            hover:bg-game-highlight
            ${mode === 'eraser' ? 'bg-blue-100' : 'bg-white'}
          `}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Eraser className="h-6 w-6" />
          </div>
        </Button>
      </div>

      <div className="flex justify-center w-full">
        <Button
          variant="ghost"
          onClick={() => setMode(mode === 'pencil' ? 'default' : 'pencil')}
          className={`w-[45px] h-[45px] p-0 ${mode === 'pencil' ? 'bg-blue-100 rounded-full' : 'rounded-full'}`}
        >
          <StickyNote className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
