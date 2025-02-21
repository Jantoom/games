import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateSudoku, isValidPlacement } from "@/lib/sudoku";
import { StickyNote } from "lucide-react";

type CellNotes = Set<number>;
type Notes = { [key: string]: CellNotes };
type Difficulty = 'easy' | 'medium' | 'hard';

export const SudokuBoard = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);
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
    setNotes({});
    setTimer(0);
    setIsActive(true);
    setDifficulty(newDifficulty);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    if (originalGrid[row][col] !== 0) {
      toast.error("Can't modify original numbers!");
      return;
    }

    if (isPencilMode) {
      const key = `${row}-${col}`;
      const currentNotes = notes[key] || new Set();
      const newNotes = new Set(currentNotes);
      
      if (newNotes.has(number)) {
        newNotes.delete(number);
      } else {
        newNotes.add(number);
      }
      
      setNotes({ ...notes, [key]: newNotes });
      return;
    }

    const newGrid = grid.map(row => [...row]);
    if (!isValidPlacement(newGrid, row, col, number)) {
      toast.error("Invalid move!");
      return;
    }
    
    newGrid[row][col] = number;
    setGrid(newGrid);

    if (!newGrid.some(row => row.includes(0))) {
      toast.success("Congratulations! You've completed the puzzle!");
      setIsActive(false);
    }
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

      <div className="grid grid-cols-9 bg-game-gridline gap-[2px] p-[2px] rounded-lg shadow-lg overflow-hidden w-[424px]">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isRelated =
              selectedCell &&
              (selectedCell.row === rowIndex ||
                selectedCell.col === colIndex ||
                (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)));

            const blockBorder = `
              ${rowIndex % 3 === 0 ? 'border-t-[2px]' : ''}
              ${colIndex % 3 === 0 ? 'border-l-[2px]' : ''}
              ${rowIndex % 3 === 2 ? 'border-b-[2px]' : ''}
              ${colIndex % 3 === 2 ? 'border-r-[2px]' : ''}
            `;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-[45px] h-[45px] flex items-center justify-center
                  ${isSelected ? 'bg-game-active hover:bg-game-active' : isRelated ? 'bg-game-highlight hover:bg-game-highlight/90' : 'bg-white hover:bg-game-highlight'}
                  border border-blue-100
                  ${blockBorder}
                  border-game-gridline
                  cursor-pointer transition-colors duration-200
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? (
                  <span className={`
                    text-xl font-medium
                    ${originalGrid[rowIndex][colIndex] !== 0 ? 'text-primary' : 'text-game-gridline'}
                    ${isSelected ? 'scale-110 transition-transform duration-200' : ''}
                  `}>
                    {cell}
                  </span>
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
            className="w-[41px] h-[41px] text-lg font-medium border-game-gridline text-game-gridline hover:bg-game-highlight"
            onClick={() => handleNumberInput(number)}
          >
            {number}
          </Button>
        ))}
      </div>

      <div className="flex justify-center w-full">
        <Button
          variant="outline"
          onClick={() => setIsPencilMode(!isPencilMode)}
          className={`w-[41px] h-[41px] transition-all ${isPencilMode ? 'bg-accent text-white' : 'border-game-gridline text-game-gridline'}`}
        >
          <StickyNote className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
