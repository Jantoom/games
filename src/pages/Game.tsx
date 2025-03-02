import { useState, useEffect, useCallback, useRef } from "react";
import { generateSudoku, getRelatedCells, isSolved, toCellKeys } from "../lib/sudoku";
import { TimerText, TimerTextHandles } from "../components/sudoku/TimerText";
import { DifficultyButtons } from "../components/sudoku/DifficultyButtons";
import { SudokuGrid } from "@/components/sudoku/SudokuGrid";
import { NumberButtons } from "../components/sudoku/NumberButtons";
import { ControlButtons } from "../components/sudoku/ControlButtons";
import { Grid, Notes, HistoryEntry, Difficulty, LeaderboardEntry } from "../lib/types";
import seedrandom from "seedrandom";

export const Game = () => {
  const [seed, setSeed] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const timerRef = useRef<TimerTextHandles>(null);
  const [isActive, setIsActive] = useState(false);
  const [solvedGrid, setSolvedGrid] = useState<Grid>([]);
  const [originalGrid, setOriginalGrid] = useState<Grid>([]);
  const [grid, setGrid] = useState<Grid>([]);
  const [notes, setNotes] = useState<Notes>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);

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
    setErrors([]);
  }, []);

  const reset = useCallback((difficulty: Difficulty) => {
    setSeed(() => {
      const seed = Math.random();
      seedrandom(`${seed}`, { global: true });
      return seed;
    });
    const { puzzle, solution } = generateSudoku(difficulty);
    setDifficulty(difficulty);
    setOriginalGrid(puzzle.map(row => [...row]));
    setSolvedGrid(solution.map(row => [...row]));
    setIsActive(true);
  }, []);

  const stop = useCallback((time: number, difficulty: Difficulty) => {
    setIsActive(() => {
      const prevLeaderboard = JSON.parse(localStorage.getItem('sudoku-leaderboard')) || [];
      const newEntry: LeaderboardEntry = {
        difficulty,
        time: time,
        seed: seed,
        date: new Date().toISOString(),
      };
      const newLeaderboard = [...prevLeaderboard, newEntry]
      newLeaderboard.sort((a, b) => a.time - b.time);
      localStorage.setItem('sudoku-leaderboard', JSON.stringify(newLeaderboard));
      return false;
    });
  }, [seed]);

  const update = useCallback((row: number, col: number, num: number, isPencilMode: boolean) => {
    setGrid(prevGrid => {
      setNotes(prevNotes => {
        setHistory(prevHistory => [...prevHistory, {
          grid: prevGrid.map(row => [...row]),
          notes: Object.fromEntries(Object.entries(prevNotes).map(([key, value]) => [key, new Set(value)]))
        }]);
        // Update notes
        const newNotes = { ...prevNotes };
        for (const key of isPencilMode ? [`${row}-${col}`] : toCellKeys(getRelatedCells(row, col))) {
          newNotes[key] = new Set(prevNotes[key]);
          if (newNotes[key].has(num)) {
            newNotes[key].delete(num);
          } else if (isPencilMode) {
            newNotes[key].add(num);
          }
        }
        if (!isPencilMode) newNotes[`${row}-${col}`] = new Set();
        return newNotes;
      });
      // Update grid
      const newGrid = prevGrid.map(r => [...r]);
      newGrid[row][col] = isPencilMode || prevGrid[row][col] === num ? 0 : num;

      // If solved, stop timer
      if (isSolved(newGrid)) stop(timerRef.current?.getTime() || 0, difficulty);
  
      return newGrid;
    });
  }, [difficulty, stop]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const prevState = prev[prev.length - 1];
      if (prevState) {
        setGrid(prevState.grid.map(row => [...row]));
        setNotes(Object.fromEntries(Object.entries(prevState.notes).map(([key, value]) => [key, new Set(value)])));
      }
      return prev.slice(0, -1)
    });
  }, []);

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (originalGrid.length > 0) restart(originalGrid);
  }, [originalGrid, restart]);

  return grid.length > 0 && (
    <div key={seed} className="flex flex-col h-svh items-center bg-background transition-colors duration-300">
      <div className="flex flex-col items-center justify-between h-screen py-8">
        <div className="flex justify-between items-center w-full">
          <TimerText ref={timerRef} isActive={isActive} />
          <DifficultyButtons difficulty={difficulty} reset={reset} />
        </div>

        <SudokuGrid 
          originalGrid={originalGrid}
          grid={grid}
          notes={notes}
          errors={errors}
          selectedNumber={selectedNumber}
          isActive={isActive}
          isPencilMode={isPencilMode}
          update={update}
        />

        <NumberButtons 
          grid={grid}
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
        />

        <ControlButtons
          seed={seed} isActive={isActive}
          solvedGrid={solvedGrid} originalGrid={originalGrid} grid={grid} notes={notes}
          setNotes={setNotes} setErrors={setErrors} restart={restart} update={update}
          canUndo={history.length > 0} onUndo={undo}
          isPencilMode={isPencilMode} setIsPencilMode={setIsPencilMode}
        />
      </div>
    </div>
  );
};
