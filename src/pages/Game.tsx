import { useState, useEffect, useCallback, useRef } from "react";
import { generateSudoku, getMatchingCells, getRelatedCells, isSolved, toCellKeys } from "../lib/sudoku";
import { SudokuCell } from "../components/sudoku/SudokuCell";
import { NumberButton } from "../components/sudoku/NumberButton";
import { ControlButtons } from "../components/sudoku/ControlButtons";
import { DifficultyButtons } from "../components/sudoku/DifficultyButtons";
import { TimerText, TimerTextHandles } from "../components/sudoku/TimerText";
import { Grid, Notes, HistoryEntry, Difficulty, LeaderboardEntry } from "../lib/types";

export const Game = () => {
  const [seed, setSeed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [solvedGrid, setSolvedGrid] = useState<Grid>([]);
  const [originalGrid, setOriginalGrid] = useState<Grid>([]);
  const [grid, setGrid] = useState<Grid>([]);
  const [notes, setNotes] = useState<Notes>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const timerRef = useRef<TimerTextHandles>(null);

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

  const reset = useCallback((newDifficulty: Difficulty) => {
    const { puzzle, solution } = generateSudoku(newDifficulty);
    setSeed(Math.random());
    setIsActive(true);
    setDifficulty(newDifficulty);
    setOriginalGrid(puzzle.map(row => [...row]));
    setSolvedGrid(solution.map(row => [...row]));
  }, []);

  const stop = useCallback((timer: number, difficulty: Difficulty) => {
    setIsActive(() => {
      const prevLeaderboard = JSON.parse(localStorage.getItem('sudoku-leaderboard')) || [];
      const newEntry: LeaderboardEntry = {
        difficulty,
        time: timer,
        date: new Date().toISOString(),
      };
      const newLeaderboard = [...prevLeaderboard, newEntry]
      newLeaderboard.sort((a, b) => a.time - b.time);
      localStorage.setItem('sudoku-leaderboard', JSON.stringify(newLeaderboard));
      return false;
    });
  }, []);

  const update = useCallback((row: number, col: number, number: number, isPencilMode: boolean) => {
    setGrid((prevGrid) => {
      setNotes((prevNotes) => {
        setHistory((prevHistory) => [
          ...prevHistory,
          {
            grid: prevGrid.map(row => [...row]), // Captures **previous** grid state
            notes: Object.fromEntries(
              Object.entries(prevNotes).map(([key, value]) => [key, new Set(value)])
            ) // Captures **previous** notes state
          }
        ]);
        // Update notes
        const newNotes = { ...prevNotes };
        for (const key of isPencilMode ? [`${row}-${col}`] : toCellKeys(getRelatedCells(row, col))) {
          newNotes[key] = new Set(prevNotes[key]);
          if (newNotes[key].has(number)) {
            newNotes[key].delete(number);
          } else if (isPencilMode) {
            newNotes[key].add(number);
          }
        }
        if (!isPencilMode) newNotes[`${row}-${col}`] = new Set();
        return newNotes;
      });
      // Update grid
      const newGrid = prevGrid.map(r => [...r]);
      newGrid[row][col] = isPencilMode || prevGrid[row][col] === number ? 0 : number;

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
    <div className="flex flex-col items-center bg-background transition-colors duration-300">
    <div key={seed} className="flex flex-col items-center justify-between h-screen py-8">
      <div className="flex justify-between items-center w-full">
        <TimerText ref={timerRef} isActive={isActive} />
        <DifficultyButtons currentDifficulty={difficulty} onSelectDifficulty={(diff) => reset(diff)} />
      </div>

      <div className="grid grid-cols-9 relative aspect-square w-[min(95vw,50vh)]">
        {grid.map((array, row) =>
          array.map((num, col) => (
            <SudokuCell
              key={`${row}-${col}`}
              num={num}
              isOriginal={originalGrid[row][col] !== 0}
              isHighlighted={selectedNumber && (num === selectedNumber || notes[`${row}-${col}`].has(selectedNumber))}
              isFlagged={errors.includes(`${row}-${col}`)}
              notes={notes[`${row}-${col}`]}
              onClick={() => isActive && selectedNumber !== null && !originalGrid[row][col] && update(row, col, selectedNumber, isPencilMode)}
            />
          ))
        )}
        <svg className="absolute pointer-events-none" viewBox="0 0 1350 1350">
          <defs>
            <svg id="small">
              <line x1="25" y1="150" x2="125" y2="150"/>
              <line x1="175" y1="150" x2="275" y2="150"/>
              <line x1="325" y1="150" x2="425" y2="150"/>
              <line x1="25" y1="300" x2="125" y2="300"/>
              <line x1="175" y1="300" x2="275" y2="300"/>
              <line x1="325" y1="300" x2="425" y2="300"/>
              <line x1="150" y1="25" x2="150" y2="125"/>
              <line x1="150" y1="175" x2="150" y2="275"/>
              <line x1="150" y1="325" x2="150" y2="425"/>
              <line x1="300" y1="25" x2="300" y2="125"/>
              <line x1="300" y1="175" x2="300" y2="275"/>
              <line x1="300" y1="325" x2="300" y2="425"/>
            </svg>
          </defs>
          <g className="stroke-primary stroke-[4.5] transition duration-300 ease-in-out">
            <line x1="450" y1="0" x2="450" y2="1350"/>
            <line x1="900" y1="0" x2="900" y2="1350"/>
            <line x1="0" y1="450" x2="1350" y2="450"/>
            <line x1="0" y1="900" x2="1350" y2="900"/>
          </g>
          <g className="stroke-secondary stroke-[1.5] transition duration-300 ease-in-out">
            <use href="#small" transform="translate(0 0)"/>
            <use href="#small" transform="translate(450 0)"/>
            <use href="#small" transform="translate(900 0)"/>
            <use href="#small" transform="translate(0 450)"/>
            <use href="#small" transform="translate(450 450)"/>
            <use href="#small" transform="translate(900 450)"/>
            <use href="#small" transform="translate(0 900)"/>
            <use href="#small" transform="translate(450 900)"/>
            <use href="#small" transform="translate(900 900)"/>
          </g>
        </svg>
      </div>

      <div className="grid grid-rows-2 grid-cols-5 gap-[min(2vh,2vw)] justify-items-center w-2/3">
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
          isActive={isActive}
          grid={grid} originalGrid={originalGrid} solvedGrid={solvedGrid} notes={notes}
          setNotes={setNotes} setErrors={setErrors} restart={restart} update={update}
          canUndo={history.length > 0} onUndo={undo}
          isPencilMode={isPencilMode} setIsPencilMode={setIsPencilMode}
        />
      </div>
    </div>
    </div>
  );
};
