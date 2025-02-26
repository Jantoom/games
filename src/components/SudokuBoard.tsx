import { useState, useEffect } from "react";
import { generateSudoku, getRelated, isValidPlacement } from "@/lib/sudoku";
import { SudokuCell } from "./sudoku/SudokuCell";
import { NumberButton } from "./sudoku/NumberButton";
import { ControlButtons } from "./sudoku/ControlButtons";
import { DifficultyButtons } from "./sudoku/DifficultyButtons";
import { HintsModal } from "./sudoku/modals/HintsModal";
import { RestartModal } from "./sudoku/modals/RestartModal";
import { ThemeModal } from "./sudoku/modals/ThemeModal";
import { LeaderboardModal } from "./sudoku/modals/LeaderboardModal";
import { Notes, GridHistory, Difficulty, Theme, LeaderboardEntry, themeColors, CellNotes } from "./sudoku/types";
import { formatTime } from "@/lib/utils";
import { TimerText } from "./sudoku/TimerText";

export const SudokuBoard = () => {
  const [seed, setSeed] = useState(0);
  const [grid, setGrid] = useState<number[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<number[][]>([]);
  const [solvedGrid, setSolvedGrid] = useState<number[][]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [notes, setNotes] = useState<Notes>({});
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [history, setHistory] = useState<GridHistory[]>([]);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme as Theme : 'light-blue';
  });
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('sudoku-leaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedLeaderboardDifficulty, setSelectedLeaderboardDifficulty] = useState<Difficulty>('easy');

  useEffect(() => {
    newGame('easy');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    for (const [colorAlias, hexCode] of Object.entries(themeColors[theme])) {
      document.documentElement.style.setProperty(`--${colorAlias}`, hexCode);
    }
  }, [theme]);

  // Difficulty buttons
  const newGame = (newDifficulty: Difficulty) => {
    const { puzzle, solution } = generateSudoku(newDifficulty);
    setSeed(Math.random());
    setIsActive(true);
    setTimer(0);
    setDifficulty(newDifficulty);
    setOriginalGrid(puzzle.map(row => [...row]));
    setGrid(puzzle.map(row => [...row]));
    setSolvedGrid(solution.map(row => [...row]));
    setSelectedNumber(null);
    setIsPencilMode(false);
    setNotes({});
    setHistory([]);
  };

  // Grid cells
  const handleCellInput = (row: number, col: number, number: number, isPencilMode: boolean) => {
    if (number === null || originalGrid[row][col] !== 0) return;
    setHistory(prev => {
      // Snapshot history
      const newHistory = [...prev, {
        grid: grid.map(row => [...row]),
        notes: Object.fromEntries(Object.entries(notes).map(([key, value]) => [key, new Set(value)]))
      }];

      // Update grid
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = isPencilMode || grid[row][col] === number ? 0 : number;
      setGrid(() => {
        // Check for completion
        if (newGrid.every((row, rowIndex) => row.every((cell, colIndex) => cell === solvedGrid[rowIndex][colIndex]))) {
          setIsActive(false);
          const newEntry: LeaderboardEntry = {
            difficulty,
            time: timer,
            date: new Date().toISOString(),
          };
          const newEntries = [...leaderboardEntries, newEntry]
            .sort((a, b) => a.time - b.time);
          setLeaderboardEntries(newEntries);
          localStorage.setItem('sudoku-leaderboard', JSON.stringify(newEntries));
          setIsLeaderboardOpen(true);
        }
        return newGrid;
      });

      // Update notes
      const newNotes = { ...notes };
      for (const currentKey of isPencilMode ? [`${row}-${col}`] : getRelated(row, col)) {
        const currentNotes = notes[currentKey] || new Set()
        if (currentNotes.has(number)) {
          currentNotes.delete(number);
        } else if (isPencilMode) {
          currentNotes.add(number);
        }
        if (currentNotes.size > 0) {
          newNotes[currentKey] = currentNotes;
        } else {
          delete newNotes[currentKey];
        }
      }
      if (!isPencilMode) delete newNotes[`${row}-${col}`];
      setNotes(newNotes);

      return newHistory
    });
  }

  // Number buttons
  const getRemainingCount = (number: number) => {
    if (number !== 0) {
      const totalCount = 9;
      const usedCount = grid.flat().filter(n => n === number).length;
      return totalCount - usedCount;
    }
  };

  // Restart button
  const restart = () => {
    setGrid(originalGrid.map(row => [...row]));
    setNotes({});
    setHistory([]);
    setIsRestartOpen(false);
  };

  // Hints button
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
      const correctNumber = solvedGrid[row][col];
      handleCellInput(row, col, correctNumber, false);
    }
    setIsHintsOpen(false);
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
    setIsHintsOpen(false);
  };
  const validateGrid = () => {
    const incorrectCells: string[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0 && grid[row][col] !== solvedGrid[row][col]) {
          incorrectCells.push(`${row}-${col}`);
        }
      }
    }
    showErrorAnimation(incorrectCells);
    setIsHintsOpen(false);
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
  const showErrorAnimation = (cells: string[]) => {
    let count = 0;
    const animate = () => {
      if (count >= 3) {
        setErrors([]);
        return;
      }
      setErrors(cells);
      setTimeout(() => {
        setErrors([]);
        setTimeout(() => {
          count++;
          animate();
        }, 500);
      }, 500);
    };
    animate();
  };

  // Undo button
  const undo = () => {
    setHistory(prev => {
      const prevState = prev[prev.length - 1];
      if (prevState) {
        setGrid(prevState.grid.map(row => [...row]));
        setNotes(Object.fromEntries(Object.entries(prevState.notes).map(([key, value]) => [key, new Set(value)])));
      }
      return prev.slice(0, -1)
    });
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen py-8">
      <div className="flex justify-between items-center w-full">
        <TimerText 
          timer={timer} 
        />
        <DifficultyButtons
          currentDifficulty={difficulty}
          onSelectDifficulty={(diff) => newGame(diff)}
        />
      </div>

      <div className="grid grid-cols-9 aspect-square">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              rowIndex={rowIndex}
              colIndex={colIndex}
              cell={cell}
              isOriginal={originalGrid[rowIndex][colIndex] !== 0}
              isHighlighted={selectedNumber !== null && selectedNumber !== 0 && (cell === selectedNumber || notes[`${rowIndex}-${colIndex}`]?.has(selectedNumber))}
              isFlagged={errors.includes(`${rowIndex}-${colIndex}`)}
              notes={notes[`${rowIndex}-${colIndex}`]}
              onClick={() => handleCellInput(rowIndex, colIndex, selectedNumber, isPencilMode)}
            />
          ))
        )}
      </div>

      <div className="grid grid-rows-2 grid-cols-5 gap-3 justify-items-center w-2/3">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <NumberButton
            key={number}
            number={number}
            isSelected={selectedNumber === number}
            remainingCount={getRemainingCount(number)}
            onClick={() => setSelectedNumber(prev => prev === number ? null : number)}
          />
        ))}
      </div>

      <div className="flex justify-evenly w-full">
        <ControlButtons
          onRestart={() => setIsRestartOpen(true)}
          onHints={() => setIsHintsOpen(true)}
          onPencil={() => setIsPencilMode(prev => !prev)}
          onUndo={undo}
          onTheme={() => setIsThemeOpen(true)}
          onLeaderboard={() => setIsLeaderboardOpen(true)}
          isPencilMode={isPencilMode}
          canUndo={history.length > 0}
          isHintsOpen={isHintsOpen}
          isRestartOpen={isRestartOpen}
          isThemeOpen={isThemeOpen}
          isLeaderboardOpen={isLeaderboardOpen}
        />
      </div>

      {(isHintsOpen || isRestartOpen || isThemeOpen || isLeaderboardOpen) && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background p-6 rounded-lg space-y-4 border w-1/2">
          {isHintsOpen && (
            <HintsModal
              onClose={() => setIsHintsOpen(false)}
              onGiveHint={giveHint}
              onShowMismatches={showMismatches}
              onValidateGrid={validateGrid}
              onAddAutoNotes={addAutoNotes}
            />
          )}
          {isRestartOpen && (
            <RestartModal
              onClose={() => setIsRestartOpen(false)}
              onRestart={restart}
            />
          )}
          {isThemeOpen && (
            <ThemeModal
              onClose={() => setIsThemeOpen(false)}
              onSelectTheme={(t) => {
                setTheme(t);
                setIsThemeOpen(false);
              }}
              currentTheme={theme}
            />
          )}
          {isLeaderboardOpen && (
            <LeaderboardModal
              onClose={() => setIsLeaderboardOpen(false)}
              entries={leaderboardEntries}
              selectedDifficulty={selectedLeaderboardDifficulty}
              onChangeDifficulty={(direction) => {
                const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
                const currentIndex = difficulties.indexOf(selectedLeaderboardDifficulty);
                const newIndex = direction === 'prev'
                  ? (currentIndex - 1 + 3) % 3
                  : (currentIndex + 1) % 3;
                setSelectedLeaderboardDifficulty(difficulties[newIndex]);
              }}
              onDeleteEntry={(index) => {
                const newEntries = leaderboardEntries.filter((_, i) => i !== index);
                setLeaderboardEntries(newEntries);
                localStorage.setItem('sudoku-leaderboard', JSON.stringify(newEntries));
              }}
            />
          )}
        </div>
      </div>
    )}
    </div>
  );
};
