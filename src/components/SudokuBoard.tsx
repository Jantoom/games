import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateSudoku, isValidPlacement } from "@/lib/sudoku";
import { SudokuCell } from "./sudoku/SudokuCell";
import { NumberButton } from "./sudoku/NumberButton";
import { ControlButtons } from "./sudoku/ControlButtons";
import { Mode, Notes, GridHistory, Difficulty } from "./sudoku/types";

export const SudokuBoard = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<number[][]>([]);
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
    if (originalGrid[row][col] !== 0) return;

    if (selectedNumber !== null) {
      saveState();
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = selectedNumber;
      setGrid(newGrid);
      return;
    }

    if (mode === 'pencil') {
      saveState();
      const key = `${row}-${col}`;
      if (grid[row][col] === 0) {
        const currentNotes = notes[key] || new Set();
        const newNotes = { ...notes };
        if (currentNotes.has(selectedNumber!)) {
          currentNotes.delete(selectedNumber!);
        } else {
          currentNotes.add(selectedNumber!);
        }
        if (currentNotes.size > 0) {
          newNotes[key] = currentNotes;
        } else {
          delete newNotes[key];
        }
        setNotes(newNotes);
      }
    } else if (selectedNumber === null) {
      const key = `${row}-${col}`;
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = 0;
      setGrid(newGrid);
      const newNotes = { ...notes };
      delete newNotes[key];
      setNotes(newNotes);
    }
  };

  const handleNumberInput = (number: number | null) => {
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
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              rowIndex={rowIndex}
              colIndex={colIndex}
              cell={cell}
              isOriginal={originalGrid[rowIndex][colIndex] !== 0}
              isHighlighted={selectedNumber !== null && cell === selectedNumber}
              notes={notes[`${rowIndex}-${colIndex}`]}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>

      <div className="grid grid-rows-2 grid-cols-5 gap-3 w-[280px]">
        <NumberButton
          number="eraser"
          isSelected={selectedNumber === null}
          onClick={() => handleNumberInput(null)}
        />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <NumberButton
            key={number}
            number={number}
            isSelected={selectedNumber === number}
            remainingCount={getRemainingCount(number)}
            onClick={() => handleNumberInput(number)}
          />
        ))}
      </div>

      <ControlButtons
        onRestart={() => setIsRestartOpen(true)}
        onHints={() => setIsHintsOpen(true)}
        onPencil={() => setMode(mode === 'pencil' ? 'default' : 'pencil')}
        onUndo={undo}
        isPencilMode={mode === 'pencil'}
        canUndo={history.length > 0}
      />

      {(isHintsOpen || isRestartOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            {isHintsOpen ? (
              <>
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
              </>
            ) : (
              <>
                <p className="text-center">Are you sure you want to restart?</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={restart} variant="outline">
                    Yes
                  </Button>
                  <Button onClick={() => setIsRestartOpen(false)} variant="outline">
                    No
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
