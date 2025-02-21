
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateSudoku, isValidPlacement } from "@/lib/sudoku";

type CellNotes = Set<number>;
type Notes = { [key: string]: CellNotes };

export const SudokuBoard = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [notes, setNotes] = useState<Notes>({});
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

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

  const newGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    const newGrid = generateSudoku(difficulty);
    setGrid(newGrid.map(row => [...row]));
    setOriginalGrid(newGrid.map(row => [...row]));
    setSelectedCell(null);
    setNotes({});
    setTimer(0);
    setIsActive(true);
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

    // Check if game is complete
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
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setIsPencilMode(!isPencilMode)}
          className={`transition-all ${isPencilMode ? 'bg-accent text-white' : 'border-game-gridline text-game-gridline'}`}
        >
          Notes Mode
        </Button>
        <span className="text-lg font-medium text-game-gridline">{formatTime(timer)}</span>
      </div>

      <div className="grid grid-cols-9 bg-game-gridline p-[2px] rounded-lg shadow-lg overflow-hidden">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isRelated =
              selectedCell &&
              (selectedCell.row === rowIndex ||
                selectedCell.col === colIndex ||
                (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)));

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 flex items-center justify-center relative
                  ${isSelected ? 'bg-game-active' : isRelated ? 'bg-game-highlight' : 'bg-white'}
                  border-r border-b border-blue-100
                  ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-game-gridline' : ''}
                  ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-game-gridline' : ''}
                  cursor-pointer transition-colors duration-200
                  hover:bg-game-highlight
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

      <div className="grid grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            variant="outline"
            className="w-12 h-12 text-lg font-medium border-game-gridline text-game-gridline hover:bg-game-highlight"
            onClick={() => handleNumberInput(number)}
          >
            {number}
          </Button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button onClick={() => newGame('easy')} className="bg-primary hover:bg-primary/90">Easy</Button>
        <Button onClick={() => newGame('medium')} className="bg-primary hover:bg-primary/90">Medium</Button>
        <Button onClick={() => newGame('hard')} className="bg-primary hover:bg-primary/90">Hard</Button>
      </div>
    </div>
  );
};
