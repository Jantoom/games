import seedrandom from 'seedrandom';
import React, { useEffect, useCallback } from 'react';
import {
  generateSudoku,
  getRelatedCells,
  isSolved,
  toCellKeys,
} from '@/lib/sudoku';
import { Difficulty, LeaderboardEntry } from '@/lib/sudokuTypes';
import TimerText from '@/components/sudoku/TimerText';
import DifficultyButtons from '@/components/sudoku/DifficultyButtons';
import SudokuGrid from '@/components/sudoku/SudokuGrid';
import NumberButtons from '@/components/sudoku/NumberButtons';
import RestartButton from '@/components/sudoku/controls/RestartButton';
import HintsButton from '@/components/sudoku/controls/HintsButton';
import PencilButton from '@/components/sudoku/controls/PencilButton';
import UndoButton from '@/components/sudoku/controls/UndoButton';
import ThemeButton from '@/components/menu/ThemeButton';
import LeaderboardButton from '@/components/sudoku/controls/LeaderboardButton';
import { useSudokuState } from '@/states/sudokuState';
import AnimatedPage from './AnimatedPage';

const Sudoku: React.FC = () => {
  const { seed, grid, setState } = useSudokuState();

  const reset = useCallback(
    (difficulty: Difficulty) => {
      const newSeed = Math.random();
      seedrandom(`${newSeed}`, { global: true });
      const { puzzle, solution } = generateSudoku(difficulty);

      setState({
        seed: newSeed,
        isActive: true,
        time: 0,
        difficulty: difficulty,
        originalGrid: puzzle.map((row) => [...row]),
        solvedGrid: solution.map((row) => [...row]),
        grid: puzzle.map((row) => [...row]),
        notes: Object.fromEntries(
          [...Array(9)].flatMap((_, row) =>
            [...Array(9)].map((_, col) => [`${row}-${col}`, new Set<number>()]),
          ),
        ),
        history: [],
        errors: [],
        selectedNumber: null,
        isPencilMode: false,
      });
    },
    [setState],
  );

  const restart = useCallback(() => {
    setState((prevState) => ({
      grid: prevState.originalGrid.map((row) => [...row]),
      notes: Object.fromEntries(
        [...Array(9)].flatMap((_, row) =>
          [...Array(9)].map((_, col) => [`${row}-${col}`, new Set<number>()]),
        ),
      ),
      history: [],
      errors: [],
      selectedNumber: null,
      isPencilMode: false,
    }));
  }, [setState]);

  const update = useCallback(
    (row: number, col: number, num: number, isPencilMode: boolean) => {
      setState((prevState) => {
        const newGrid = prevState.grid.map((r) => [...r]);
        newGrid[row][col] =
          isPencilMode || prevState.grid[row][col] === num ? 0 : num;

        const newNotes = { ...prevState.notes };
        for (const key of isPencilMode
          ? [`${row}-${col}`]
          : toCellKeys(getRelatedCells(row, col))) {
          newNotes[key] = new Set(prevState.notes[key]);
          if (newNotes[key].has(num)) {
            newNotes[key].delete(num);
          } else if (isPencilMode) {
            newNotes[key].add(num);
          }
        }
        if (!isPencilMode) newNotes[`${row}-${col}`] = new Set();

        const newHistory = [
          ...prevState.history,
          {
            grid: prevState.grid.map((row) => [...row]),
            notes: Object.fromEntries(
              Object.entries(prevState.notes).map(([key, value]) => [
                key,
                new Set(value),
              ]),
            ),
          },
        ];

        return { grid: newGrid, notes: newNotes, history: newHistory };
      });
    },
    [setState],
  );

  const undo = useCallback(() => {
    setState((prevState) => {
      if (prevState.history.length === 0) return {};
      const lastStep = prevState.history[prevState.history.length - 1];
      return {
        grid: lastStep.grid.map((row) => [...row]),
        notes: Object.fromEntries(
          Object.entries(lastStep.notes).map(([key, value]) => [
            key,
            new Set(value),
          ]),
        ),
        history: prevState.history.slice(0, -1),
      };
    });
  }, [setState]);

  const stop = useCallback(() => {
    setState((prevState) => {
      const prevLeaderboard =
        JSON.parse(localStorage.getItem('sudoku-leaderboard')) || [];
      const newEntry: LeaderboardEntry = {
        seed: prevState.seed,
        time: prevState.time,
        difficulty: prevState.difficulty,
        date: new Date().toISOString(),
      };
      const newLeaderboard = [...prevLeaderboard, newEntry];
      newLeaderboard.sort((a, b) => a.time - b.time);
      localStorage.setItem(
        'sudoku-leaderboard',
        JSON.stringify(newLeaderboard),
      );

      return { isActive: false, selectedNumber: null };
    });
  }, [setState]);

  useEffect(() => {
    reset('easy');
  }, [reset]);

  useEffect(() => {
    if (grid.length > 0 && isSolved(grid)) stop();
  }, [grid, stop]);

  return (
    grid.length > 0 && (
      <AnimatedPage>
        <div
          key={seed}
          className="flex flex-col h-svh items-center py-8"
        >
          <div className="flex flex-col items-center justify-between h-screen">
            <div className="flex justify-between items-center w-full">
              <TimerText />
              <DifficultyButtons reset={reset} />
            </div>

            <SudokuGrid update={update} />

            <NumberButtons />

            <div className="flex justify-evenly w-full">
              <RestartButton restart={restart} />
              <HintsButton update={update} />
              <PencilButton />
              <UndoButton undo={undo} />
              <LeaderboardButton />
            </div>
          </div>
        </div>
      </AnimatedPage>
    )
  );
};

export default Sudoku;
