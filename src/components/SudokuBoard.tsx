import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateSudoku, isValidPlacement } from "@/lib/sudoku";
import { StickyNote, Eraser, Undo, Lightbulb } from "lucide-react";

type Mode = 'default' | 'pencil' | 'eraser';
type CellNotes = Set<number>;
type Notes = { [key: string]: CellNotes };
type Difficulty = 'easy' | 'medium' | 'hard';

interface GridHistory {
  grid: number[][];
  notes: Notes;
}

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
  const [history, setHistory] = useState<GridHistory[]>([]);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isRestartOpen, setIsRestartOpen] = useState(false);

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

  const saveState = () => {
    setHistory(prev => [...prev, {
      grid: grid.map(row => [...row]),
      notes: { ...notes }
    }]);
  };

  const undo = () => {
    const prevState = history[history.length - 1];
    if (prevState) {
      setGrid(prevState.grid.map(row => [...row]));
      setNotes({ ...prevState.notes });
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const restart = () => {
    setGrid(originalGrid.map(row => [...row]));
    setNotes({});
    setHistory([]);
    setIsRestartOpen(false);
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
    setIsHintsOpen(false);
  };

  const validateGrid = () => {
    const incorrectCells: HTMLElement[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) {
          const temp = grid[row][col];
          grid[row][col] = 0;
          if (!isValidPlacement(grid, row, col, temp)) {
            const cell = document.querySelector(`[data-pos="${row}-${col}"]`);
            if (cell) incorrectCells.push(cell as HTMLElement);
          }
          grid[row][col] = temp;
        }
      }
    }
    incorrectCells.forEach(cell => {
      cell.classList.add('animate-[pulse_0.5s_ease-in-out_infinite]', 'bg-red-200');
      setTimeout(() => {
        cell.classList.remove('animate-[pulse_0.5s_ease-in-out_infinite]', 'bg-red-200');
      }, 1500);
    });
    setIsHintsOpen(false);
  };

  const showMismatches = () => {
    const mismatchCells: HTMLElement[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) {
          // Check row
          for (let x = 0; x < 9; x++) {
            if (x !== col && grid[row][x] === grid[row][col]) {
              const cell1 = document.querySelector(`[data-pos="${row}-${col}"]`);
              const cell2 = document.querySelector(`[data-pos="${row}-${x}"]`);
              if (cell1) mismatchCells.push(cell1 as HTMLElement);
              if (cell2) mismatchCells.push(cell2 as HTMLElement);
            }
          }
          // Check column
          for (let y = 0; y < 9; y++) {
            if (y !== row && grid[y][col] === grid[row][col]) {
              const cell1 = document.querySelector(`[data-pos="${row}-${col}"]`);
              const cell2 = document.querySelector(`[data-pos="${y}-${col}"]`);
              if (cell1) mismatchCells.push(cell1 as HTMLElement);
              if (cell2) mismatchCells.push(cell2 as HTMLElement);
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
                const cell1 = document.querySelector(`[data-pos="${row}-${col}"]`);
                const cell2 = document.querySelector(`[data-pos="${y}-${x}"]`);
                if (cell1) mismatchCells.push(cell1 as HTMLElement);
                if (cell2) mismatchCells.push(cell2 as HTMLElement);
              }
            }
          }
        }
      }
    }
    mismatchCells.forEach(cell => {
      cell.classList.add('animate-[pulse_0.5s_ease-in-out_infinite]', 'bg-red-200');
      setTimeout(() => {
        cell.classList.remove('animate-[pulse_0.5s_ease-in-out_infinite]', 'bg-red-200');
      }, 1500);
    });
    setIsHintsOpen(false);
  };

  const giveHint = () => {
    const emptyCells: [number, number][] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      // Find correct number (you'd need the solution grid for this)
      // For now, find a valid number
      for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(grid, row, col, num)) {
          saveState();
          const newGrid = grid.map(r => [...r]);
          newGrid[row][col] = num;
          setGrid(newGrid);
          break;
        }
      }
    }
    setIsHintsOpen(false);
  };

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
                data-pos={`${rowIndex}-${colIndex}`}
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
        <Button
          variant="outline"
          onClick={() => {
            setMode('eraser');
            setSelectedNumber(null);
          }}
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
      </div>

      <div className="flex justify-center gap-4 w-full">
        <Button
          variant="ghost"
          onClick={() => setIsRestartOpen(true)}
          className="w-[45px] h-[45px] p-0 rounded-full"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 12a9 9 0 1 1 9 9M3 12h9" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsHintsOpen(true)}
          className="w-[45px] h-[45px] p-0 rounded-full"
        >
          <Lightbulb className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setMode(mode === 'pencil' ? 'default' : 'pencil')}
          className={`w-[45px] h-[45px] p-0 ${mode === 'pencil' ? 'bg-blue-100 rounded-full' : 'rounded-full'}`}
        >
          <StickyNote className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={undo}
          disabled={history.length === 0}
          className="w-[45px] h-[45px] p-0 rounded-full"
        >
          <Undo className="h-5 w-5" />
        </Button>
      </div>

      {isHintsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <Button onClick={giveHint} variant="outline" className="w-full">
              Hint
            </Button>
            <Button onClick={showMismatches} variant="outline" className="w-full">
              Show Mismatches
            </Button>
            <Button onClick={validateGrid} variant="outline" className="w-full">
              Validate Grid
            </Button>
            <Button onClick={addAutoNotes} variant="outline" className="w-full">
              Auto Notes
            </Button>
            <Button onClick={() => setIsHintsOpen(false)} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      {isRestartOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <p className="text-center">Are you sure you want to restart?</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={restart} variant="outline">
                Yes
              </Button>
              <Button onClick={() => setIsRestartOpen(false)} variant="outline">
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
