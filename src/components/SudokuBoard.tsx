import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateSudoku, isValidPlacement } from "@/lib/sudoku";
import { SudokuCell } from "./sudoku/SudokuCell";
import { NumberButton } from "./sudoku/NumberButton";
import { ControlButtons } from "./sudoku/ControlButtons";
import { Mode, Notes, GridHistory, Difficulty, Theme, LeaderboardEntry } from "./sudoku/types";

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
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light-blue');
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('sudoku-leaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedLeaderboardDifficulty, setSelectedLeaderboardDifficulty] = useState<Difficulty>('easy');

  const newGame = (newDifficulty: Difficulty) => {
    const newGrid = generateSudoku(newDifficulty);
    setIsActive(true);
    setTimer(0);
    setDifficulty(newDifficulty);
    setOriginalGrid(newGrid.map(row => [...row]));
    setGrid(newGrid.map(row => [...row]));
    setSelectedNumber(null);
    setMode('default');
    setNotes({});
    setHistory([]);
  };
  useEffect(() => {
    newGame('easy');
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
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
      for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(grid, row, col, num)) {
          saveState();
          const newGrid = grid.map(r => [...r]);
          newGrid[row][col] = num;
          setGrid(newGrid);
          const newNotes = {
            ...notes
          };
          delete newNotes[`${row}-${col}`];
          setNotes(newNotes);
          break;
        }
      }
    }
    setIsHintsOpen(false);
  };
  const showMismatches = () => {
    const mismatchCells: string[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) {
          for (let x = 0; x < 9; x++) {
            if (x !== col && grid[row][x] === grid[row][col]) {
              mismatchCells.push(`${row}-${col}`);
              mismatchCells.push(`${row}-${x}`);
            }
          }
          for (let y = 0; y < 9; y++) {
            if (y !== row && grid[y][col] === grid[row][col]) {
              mismatchCells.push(`${row}-${col}`);
              mismatchCells.push(`${y}-${col}`);
            }
          }
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
    let tempGrid = grid.map(row => [...row]);

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (originalGrid[row][col] === 0 && tempGrid[row][col] !== 0) {
                let tempValue = tempGrid[row][col];
                tempGrid[row][col] = 0;

                if (!isValidPlacement(tempGrid, row, col, tempValue)) {
                    incorrectCells.push(`${row}-${col}`);
                }

                tempGrid[row][col] = tempValue;
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
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="flex justify-between items-center w-[424px]">
        <span className="text-lg font-medium text-color-2">{formatTime(timer)}</span>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <Button
              key={diff}
              onClick={() => newGame(diff)}
              variant={difficulty === diff ? 'default' : 'outline'}
              className={
                difficulty === diff
                  ? 'bg-color-5 text-color-1 hover:bg-color-5/90'
                  : 'border-color-3 text-color-2 hover:bg-color-4'
              }
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-9 bg-color-5 gap-[1px] p-[1px] rounded-lg shadow-lg overflow-hidden w-[424px]">
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

      <ControlButtons onRestart={() => setIsRestartOpen(true)} onHints={() => setIsHintsOpen(true)} onPencil={() => setMode(prev => prev === 'default' ? 'pencil' : 'default')} onUndo={undo} onTheme={() => setIsThemeOpen(true)} onLeaderboard={() => setIsLeaderboardOpen(true)} isPencilMode={mode === 'pencil'} canUndo={history.length > 0} />

      {(isHintsOpen || isRestartOpen || isThemeOpen || isLeaderboardOpen) && (
        <div className="fixed inset-0 bg-color-1/50 flex items-center justify-center z-50">
          <div className="bg-color-1 p-6 rounded-lg shadow-lg space-y-4 border border-color-3 w-[340px]">
            {isHintsOpen ? (
              <>
                <Button onClick={giveHint} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  Hint
                </Button>
                <Button onClick={showMismatches} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  Show Mismatches
                </Button>
                <Button onClick={validateGrid} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  Validate Grid
                </Button>
                <Button onClick={addAutoNotes} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  Auto Notes
                </Button>
                <Button onClick={() => setIsHintsOpen(false)} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  Close
                </Button>
              </>
            ) : isRestartOpen ? (
              <div className="flex flex-col gap-4">
                <p className="text-center text-color-2">Are you sure you want to restart?</p>
                <Button onClick={restart} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  Yes
                </Button>
                <Button onClick={() => setIsRestartOpen(false)} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  No
                </Button>
              </div>
            ) : isThemeOpen ? (
              <>
                <h3 className="text-lg font-semibold text-center mb-4 text-color-2">Select Theme</h3>
                <div className="space-y-2">
                  {(['dark-blue', 'light-blue', 'dark-red'] as Theme[]).map(t => (
                    <Button
                      key={t}
                      onClick={() => {
                        setTheme(t);
                        setIsThemeOpen(false);
                      }}
                      variant="outline"
                      className={`w-full border-color-3 text-color-2 ${theme === t ? 'bg-color-5 text-color-1' : 'hover:bg-color-4'}`}
                    >
                      {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Button>
                  ))}
                </div>
                <Button onClick={() => setIsThemeOpen(false)} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  Close
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-center mb-4 text-color-2">Leaderboard</h3>
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedLeaderboardDifficulty(prev => {
                      const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
                      const currentIndex = difficulties.indexOf(prev);
                      return difficulties[(currentIndex - 1 + 3) % 3];
                    })}
                    className="w-10 h-10 p-0 text-color-2 hover:bg-color-4 rounded-full"
                  >
                    <svg className="h-5 w-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </Button>
                  <span className="text-color-2 capitalize">{selectedLeaderboardDifficulty}</span>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedLeaderboardDifficulty(prev => {
                      const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
                      const currentIndex = difficulties.indexOf(prev);
                      return difficulties[(currentIndex + 1) % 3];
                    })}
                    className="w-10 h-10 p-0 text-color-2 hover:bg-color-4 rounded-full"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </Button>
                </div>
                <div className="h-60 overflow-y-auto space-y-2 mb-4">
                  {leaderboardEntries
                    .filter(entry => entry.difficulty === selectedLeaderboardDifficulty)
                    .map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-color-1 border border-color-3 rounded">
                        <span className="text-color-2">{formatTime(entry.time)}</span>
                        <span className="text-color-2">{new Date(entry.date).toLocaleDateString()}</span>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            const newEntries = leaderboardEntries.filter((_, i) => i !== index);
                            setLeaderboardEntries(newEntries);
                            localStorage.setItem('sudoku-leaderboard', JSON.stringify(newEntries));
                          }}
                          className="w-8 h-8 p-0 text-color-2 hover:bg-color-4 rounded-full"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </Button>
                      </div>
                    ))}
                </div>
                <Button onClick={() => setIsLeaderboardOpen(false)} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
