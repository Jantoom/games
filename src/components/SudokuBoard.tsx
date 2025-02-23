import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateSudoku, isValidPlacement } from "@/lib/sudoku";
import { StickyNote } from "lucide-react";

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
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isRelated = selectedCell &&
              (selectedCell.row === rowIndex ||
                selectedCell.col === colIndex ||
                (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)));
            const isHighlighted = selectedNumber !== null && cell === selectedNumber;

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
                  ${isSelected ? 'bg-game-active hover:bg-game-active' : isRelated ? 'bg-game-highlight hover:bg-game-highlight/90' : 'bg-white hover:bg-game-highlight'}
                  border-[0.5px] border-blue-100
                  ${blockBorder}
                  border-game-gridline
                  cursor-pointer transition-colors duration-200
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? (
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${originalGrid[rowIndex][colIndex] !== 0 
                      ? 'bg-neutral-100'
                      : isHighlighted 
                        ? 'bg-blue-100'
                        : 'bg-transparent'
                    }
                  `}>
                    <span className={`
                      text-xl font-medium
                      ${originalGrid[rowIndex][colIndex] !== 0 ? 'text-primary' : 'text-game-gridline'}
                      ${isSelected ? 'scale-110 transition-transform duration-200' : ''}
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

      <div className="grid grid-cols-9 gap-3 w-[424px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            variant="outline"
            className={`
              w-[41px] h-[41px] p-0 relative
              text-lg font-medium border-game-gridline text-game-gridline 
              hover:bg-game-highlight
              ${selectedNumber === number ? 'bg-blue-100' : ''}
            `}
            onClick={() => handleNumberInput(number)}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              {number}
            </div>
          </Button>
        ))}
      </div>

      <div className="flex justify-center w-full">
        <Button
          variant="outline"
          onClick={() => setMode(mode === 'pencil' ? 'default' : 'pencil')}
          className={`w-[41px] h-[41px] transition-all ${mode === 'pencil' ? 'bg-accent text-white' : 'border-game-gridline text-game-gridline'}`}
        >
          <StickyNote className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
