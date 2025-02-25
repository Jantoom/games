import { useState, useEffect } from "react";
import { generateSudoku, isValidPlacement } from "@/lib/sudoku";
import { SudokuCell } from "./sudoku/SudokuCell";
import { NumberButton } from "./sudoku/NumberButton";
import { ControlButtons } from "./sudoku/ControlButtons";
import { DifficultyButtons } from "./sudoku/DifficultyButtons";
import { HintsModal } from "./sudoku/modals/HintsModal";
import { RestartModal } from "./sudoku/modals/RestartModal";
import { ThemeModal } from "./sudoku/modals/ThemeModal";
import { LeaderboardModal } from "./sudoku/modals/LeaderboardModal";
import { Mode, Notes, GridHistory, Difficulty, Theme, LeaderboardEntry } from "./sudoku/types";

export const SudokuBoard = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [originalGrid, setOriginalGrid] = useState<number[][]>([]);
  const [solvedGrid, setSolvedGrid] = useState<number[][]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>('default');
  const [notes, setNotes] = useState<Notes>({});
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [history, setHistory] = useState<GridHistory[]>([]);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light-blue');
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('sudoku-leaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedLeaderboardDifficulty, setSelectedLeaderboardDifficulty] = useState<Difficulty>('easy');

  const newGame = (newDifficulty: Difficulty) => {
    const { puzzle, solution } = generateSudoku(newDifficulty);
    setIsActive(true);
    setTimer(0);
    setDifficulty(newDifficulty);
    setOriginalGrid(puzzle.map(row => [...row]));
    setGrid(puzzle.map(row => [...row]));
    setSolvedGrid(solution.map(row => [...row]));
    setSelectedNumber(null);
    setMode('default');
    setNotes({});
    setHistory([]);
  };

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
      saveState();
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = correctNumber;
      setGrid(newGrid);
      const newNotes = { ...notes };
      delete newNotes[`${row}-${col}`];
      setNotes(newNotes);
    }
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const saveState = () => {
    setHistory(prev => [...prev, {
      grid: grid.map(row => [...row]),
      notes: {
        ...notes
      }
    }]);
  };

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

  const handleCellClick = (row: number, col: number) => {
    if (selectedNumber === null || originalGrid[row][col] !== 0) return;
    if (mode === 'pencil') {
      saveState();
      const key = `${row}-${col}`;
      if (grid[row][col] === 0) {
        const currentNotes = notes[key] || new Set();
        const newNotes = {
          ...notes
        };
        if (currentNotes.has(selectedNumber)) {
          currentNotes.delete(selectedNumber);
        } else {
          currentNotes.add(selectedNumber);
        }
        if (currentNotes.size > 0) {
          newNotes[key] = currentNotes;
        } else {
          delete newNotes[key];
        }
        setNotes(newNotes);
      }
    } else {
      saveState();
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = selectedNumber;
      setGrid(newGrid);
      if (selectedNumber === 0) {
        const key = `${row}-${col}`;
        const newNotes = {
          ...notes
        };
        delete newNotes[key];
        setNotes(newNotes);
      }
      return;
    }
  };

  const handleNumberInput = (number: number | null) => {
    setSelectedNumber(prev => prev === number ? null : number);
  };

  const getRemainingCount = (number: number) => {
    if (number !== 0) {
      const totalCount = 9;
      const usedCount = grid.flat().filter(n => n === number).length;
      return totalCount - usedCount;
    }
  };

  const isGridComplete = () => {
    return grid.every(row => row.every(cell => cell !== 0));
  };

  useEffect(() => {
    if (isGridComplete()) {
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
  }, [grid]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 px-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-[424px]">
        <div className="flex justify-between items-center w-full">
          <span className="text-lg font-medium text-color-2">{formatTime(timer)}</span>
          <DifficultyButtons
            currentDifficulty={difficulty}
            onSelectDifficulty={(diff) => newGame(diff)}
          />
        </div>

        <div className="grid grid-cols-9 bg-color-5 gap-[1px] p-[1px] rounded-lg shadow-lg overflow-hidden w-full">
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
            isSelected={selectedNumber === 0}
            onClick={() => handleNumberInput(0)}
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
          onPencil={() => setMode(prev => prev === 'default' ? 'pencil' : 'default')}
          onUndo={undo}
          onTheme={() => setIsThemeOpen(true)}
          onLeaderboard={() => setIsLeaderboardOpen(true)}
          isPencilMode={mode === 'pencil'}
          canUndo={history.length > 0}
          isHintsOpen={isHintsOpen}
          isRestartOpen={isRestartOpen}
          isThemeOpen={isThemeOpen}
          isLeaderboardOpen={isLeaderboardOpen}
        />
      </div>

      {(isHintsOpen || isRestartOpen || isThemeOpen || isLeaderboardOpen) && (
        <div className="fixed inset-0 bg-color-1/50 flex items-center justify-center z-50">
          <div className="bg-color-1 p-6 rounded-lg shadow-lg space-y-4 border border-color-3 w-[340px]">
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
                formatTime={formatTime}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
