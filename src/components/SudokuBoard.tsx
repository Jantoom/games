import { useState, useEffect, useCallback } from "react";
import { generateSudoku, getAutoNotes, getHintCells, getMismatchCells, getMatchingCells, getConflictCells, getRelatedCells, isSolved, toCellCoords, toCellKeys } from "@/lib/sudoku";
import { SudokuCell } from "./sudoku/SudokuCell";
import { NumberButton } from "./sudoku/NumberButton";
import { ControlButtons } from "./sudoku/ControlButtons";
import { DifficultyButtons } from "./sudoku/DifficultyButtons";
import { HintsModal } from "./sudoku/modals/HintsModal";
import { RestartModal } from "./sudoku/modals/RestartModal";
import { ThemeModal } from "./sudoku/modals/ThemeModal";
import { LeaderboardModal } from "./sudoku/modals/LeaderboardModal";
import { TimerText } from "./sudoku/TimerText";
import { Grid, Notes, HistoryEntry, Difficulty, LeaderboardEntry } from "@/lib/types";
import { Themes } from "@/lib/theme";

export const SudokuBoard = () => {
  const [seed, setSeed] = useState(0);
  const [grid, setGrid] = useState<Grid>([]);
  const [originalGrid, setOriginalGrid] = useState<Grid>([]);
  const [solvedGrid, setSolvedGrid] = useState<Grid>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [notes, setNotes] = useState<Notes>({});
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light-blue';
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('sudoku-leaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedLeaderboardDifficulty, setSelectedLeaderboardDifficulty] = useState<Difficulty>('easy');

  const restart = useCallback((originalGrid: Grid) => {
    setGrid(originalGrid.map(row => [...row]));
    setSelectedNumber(null);
    setIsPencilMode(false);
    setNotes(Object.fromEntries(
      [...Array(9)].flatMap((_, row) =>
        [...Array(9)].map((_, col) => [`${row}-${col}`, new Set<number>()])
      )
    ));
    setHistory([]);
  }, []);

  const reset = useCallback((newDifficulty: Difficulty) => {
    const { puzzle, solution } = generateSudoku(newDifficulty);
    setSeed(Math.random());
    setIsActive(true);
    setTimer(0);
    setDifficulty(newDifficulty);
    setOriginalGrid(puzzle.map(row => [...row]));
    setSolvedGrid(solution.map(row => [...row]));
    restart(puzzle);
  }, [restart]);

  const stop = useCallback((timer: number, difficulty: Difficulty, leaderboard: LeaderboardEntry[]) => {
    setIsActive(false);
    const newEntry: LeaderboardEntry = {
      difficulty,
      time: timer,
      date: new Date().toISOString(),
    };
    const newLeaderboard = [...leaderboard, newEntry].sort((a, b) => a.time - b.time);
    setLeaderboard(newLeaderboard);
    localStorage.setItem('sudoku-leaderboard', JSON.stringify(newLeaderboard));
    setIsLeaderboardOpen(true);
  }, []);

  useEffect(() => {
    reset('easy');
  }, [reset]);

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
    for (const [colorAlias, hexCode] of Object.entries(Themes[theme])) {
      document.documentElement.style.setProperty(`--${colorAlias}`, hexCode);
    }
  }, [theme]);

  // Grid cells
  const handleCellInput = (row: number, col: number, number: number, isPencilMode: boolean) => {
    if (number === null || originalGrid[row][col] !== 0 || !isActive) return;
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
        if (isSolved(newGrid)) stop(timer, difficulty, leaderboard);
        return newGrid;
      });

      // Update notes
      const newNotes = { ...notes };
      for (const currentKey of isPencilMode ? [`${row}-${col}`] : toCellKeys(getRelatedCells(row, col))) {
        const currentNotes = notes[currentKey];
        if (currentNotes.has(number)) {
          currentNotes.delete(number);
        } else if (isPencilMode) {
          currentNotes.add(number);
        }
        newNotes[currentKey] = currentNotes;
      }
      if (!isPencilMode) newNotes[`${row}-${col}`] = new Set();
      setNotes(newNotes);

      return newHistory
    });
  }

  // Hints button
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

  return grid.length > 0 && (
    <div key={seed} className="flex flex-col items-center justify-between h-screen py-8">
      <div className="flex justify-between items-center w-full">
        <TimerText 
          timer={timer} 
        />
        <DifficultyButtons
          currentDifficulty={difficulty}
          onSelectDifficulty={(diff) => reset(diff)}
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
              isHighlighted={selectedNumber !== null && selectedNumber !== 0 && (cell === selectedNumber || notes[`${rowIndex}-${colIndex}`].has(selectedNumber))}
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
            remainingCount={9 - getMatchingCells(grid, number).length}
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
              onGiveHint={() => {
                const targetCells = getHintCells(grid, notes, solvedGrid);
                if (targetCells.length > 0) {
                  const {row, col} = targetCells[Math.floor(Math.random() * targetCells.length)];
                  const correctNumber = solvedGrid[row][col];
                  handleCellInput(row, col, correctNumber, false);
                }
                setIsHintsOpen(false);
              }}
              onShowMismatches={() => {
                showErrorAnimation(toCellKeys(getConflictCells(grid)));
                setIsHintsOpen(false);
              }}
              onValidateGrid={() => {
                showErrorAnimation(toCellKeys(getMismatchCells(grid, solvedGrid)));
                setIsHintsOpen(false);
              }}
              onAddAutoNotes={() => {
                setNotes({...notes, ...getAutoNotes(grid)})
                setIsHintsOpen(false);
              }}
            />
          )}
          {isRestartOpen && (
            <RestartModal
              onClose={() => setIsRestartOpen(false)}
              onRestart={() => restart(originalGrid)}
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
              entries={leaderboard}
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
                const newLeaderboard = leaderboard.filter((_, i) => i !== index);
                setLeaderboard(newLeaderboard);
                localStorage.setItem('sudoku-leaderboard', JSON.stringify(newLeaderboard));
              }}
            />
          )}
        </div>
      </div>
    )}
    </div>
  );
};
