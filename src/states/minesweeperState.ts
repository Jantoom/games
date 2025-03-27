import { generateMinesweeper, getSafeCells } from '@/lib/minesweeper';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
} from '@/lib/minesweeperTypes';
import seedrandom from 'seedrandom';
import { create } from 'zustand';

interface MinesweeperState {
  seed: number;
  isActive: boolean;
  time: number;
  difficulty: Difficulty;
  dimensions: [number, number];
  bombs: number;
  solvedGrid: Grid;
  grid: Grid;
  flags: Set<string>;
  history: HistoryEntry[];
  isFlagMode: boolean;
  flagOnClick: boolean;
  flagOnDoubleClick: boolean;
  flagOnLongClick: boolean;
  flagOnRightClick: boolean;
  leaderboard: LeaderboardEntry[];
  setState: (
    state:
      | Partial<MinesweeperState>
      | ((state: MinesweeperState) => Partial<MinesweeperState>),
  ) => void;
  reset: (difficulty: Difficulty) => void;
  update: (row: number, col: number, isFlagMode: boolean) => void;
  stop: () => void;
}

export const useMinesweeperState = create<MinesweeperState>((set) => ({
  seed: 0,
  isActive: false,
  time: 0,
  difficulty: 'easy',
  dimensions: [0, 0],
  bombs: 0,
  solvedGrid: [],
  grid: [],
  flags: new Set(),
  history: [],
  isFlagMode: false,
  flagOnClick: false,
  flagOnDoubleClick: true,
  flagOnLongClick: true,
  flagOnRightClick: true,
  leaderboard: [],
  setState: (newState) => set(newState),
  reset: (difficulty) => {
    const newSeed = Math.random();
    seedrandom(`${newSeed}`, { global: true });
    const { puzzle, solution, dimensions, bombs } =
      generateMinesweeper(difficulty);

    set({
      seed: newSeed,
      isActive: true,
      time: 0,
      difficulty: difficulty,
      dimensions: dimensions,
      bombs: bombs,
      solvedGrid: solution.map((row) => [...row]),
      grid: puzzle.map((row) => [...row]),
      flags: new Set(),
      history: [],
    });
  },
  update: (row, col, isFlagMode) => {
    set((prevState) => {
      if (!prevState.isActive) return;

      const newFlags = new Set(prevState.flags);
      const newHistory = [
        ...prevState.history,
        {
          grid: prevState.grid.map((row) => [...row]),
          flags: new Set(prevState.flags),
        },
      ];

      if (isFlagMode && prevState.grid[row][col] === -1) {
        if (newFlags.has(`${row}-${col}`)) {
          newFlags.delete(`${row}-${col}`);
        } else {
          newFlags.add(`${row}-${col}`);
        }
        return { flags: newFlags, history: newHistory };
      }

      const newGrid = prevState.grid.map((r) => [...r]);
      const safeCells = getSafeCells(prevState.solvedGrid, row, col);
      if (safeCells.length === 0) {
        ;
      }
      safeCells.forEach(
        ({ row, col }) => {
          newGrid[row][col] = prevState.solvedGrid[row][col]
          newFlags.delete(`${row}-${col}`);
        },
      );

      return { grid: newGrid, flags: newFlags, history: newHistory };
    });
  },
  stop: () => {
    set((prevState) => {
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
  },
}));
