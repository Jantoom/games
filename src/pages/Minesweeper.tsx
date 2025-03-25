import React, { useCallback, useEffect } from 'react';
import AnimatedPage from './AnimatedPage';
import MinesweeperGrid from '@/components/minesweeper/MinesweeperGrid';
import { useMinesweeperState } from '@/states/minesweeperState';
import { Difficulty } from '@/lib/sudokuTypes';
import seedrandom from 'seedrandom';
import { generateMinesweeper, getSafeCells, isSolved } from '@/lib/minesweeper';
import { LeaderboardEntry } from '@/lib/minesweeperTypes';
import TimerText from '@/components/minesweeper/TimerText';
import DifficultyButtons from '@/components/minesweeper/DifficultyButtons';

const Minesweeper: React.FC = () => {
  const { seed, grid, setState } = useMinesweeperState();

  const reset = useCallback(
    (difficulty: Difficulty) => {
      const newSeed = Math.random();
      seedrandom(`${newSeed}`, { global: true });
      const { puzzle, solution } = generateMinesweeper(difficulty);

      setState({
        seed: newSeed,
        isActive: true,
        time: 0,
        difficulty: difficulty,
        originalGrid: puzzle.map((row) => [...row]),
        solvedGrid: solution.map((row) => [...row]),
        grid: puzzle.map((row) => [...row]),
        history: [],
      });
    },
    [setState],
  );

  const update = useCallback(
    (row: number, col: number) => {
      setState((prevState) => {
        const safeCells = getSafeCells(prevState.solvedGrid, row, col);
        if (safeCells.length === 0) {
          ;
        }

        const newGrid = prevState.grid.map((r) => [...r]);
        safeCells.forEach(
          ({ row, col }) =>
            (newGrid[row][col] = prevState.solvedGrid[row][col]),
        );

        const newHistory = [
          ...prevState.history,
          {
            grid: prevState.grid.map((row) => [...row]),
          },
        ];

        return { grid: newGrid, history: newHistory };
      });
    },
    [setState],
  );

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
          <MinesweeperGrid update={update} />
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Minesweeper;
