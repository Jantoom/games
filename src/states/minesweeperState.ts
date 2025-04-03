import {
  generateMinesweeper,
  getAdjacentCells,
  getAdjacentSafeCells,
  getSafeCells,
  toCellCoords,
} from '@/lib/minesweeper';
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
  numBombs: number;
  grid: Grid;
  bombs: Set<string>;
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
  stop: (win: boolean) => void;
}

export const useMinesweeperState = create<MinesweeperState>((set) => ({
  seed: 0,
  isActive: false,
  time: 0,
  difficulty: 'easy',
  dimensions: [0, 0],
  numBombs: 0,
  grid: [],
  bombs: new Set(),
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
    const { dimensions, numBombs, puzzle, bombs } =
      generateMinesweeper(difficulty);

    set({
      seed: newSeed,
      isActive: true,
      time: 0,
      difficulty: difficulty,
      dimensions: dimensions,
      numBombs: numBombs,
      grid: puzzle.map((row) => [...row]),
      bombs: new Set(bombs),
      flags: new Set(),
      history: [],
    });
  },
  update: (row, col, isFlagMode) => {
    set((prevState) => {
      if (!prevState.isActive) return {};

      const newHistory = [
        ...prevState.history,
        {
          grid: prevState.grid.map((row) => [...row]),
          flags: new Set(prevState.flags),
        },
      ];

      const newFlags = new Set(prevState.flags);
      if (isFlagMode && prevState.grid[row][col] === null) {
        if (newFlags.has(`${row}-${col}`)) {
          newFlags.delete(`${row}-${col}`);
        } else {
          newFlags.add(`${row}-${col}`);
        }
        return { flags: newFlags, history: newHistory };
      }

      const newGrid = prevState.grid.map((r) => [...r]);
      const safeCells = getSafeCells(prevState.bombs, row, col);
      if (safeCells.length === 0) {
        prevState.stop(false);
        return {};
      }
      safeCells.forEach(({ row, col, adjacentBombs }) => {
        newGrid[row][col] = adjacentBombs;
        newFlags.delete(`${row}-${col}`);
      });

      return { grid: newGrid, flags: newFlags, history: newHistory };
    });
  },
  stop: (win) => {
    set((prevState) => {
      const prevLeaderboard =
        JSON.parse(localStorage.getItem('minesweeper-leaderboard')) || [];
      const newEntry: LeaderboardEntry = {
        seed: prevState.seed,
        time: prevState.time,
        difficulty: prevState.difficulty,
        date: new Date().toISOString(),
      };
      const newLeaderboard = [...prevLeaderboard, newEntry];
      newLeaderboard.sort((a, b) => a.time - b.time);
      localStorage.setItem(
        'minesweeper-leaderboard',
        JSON.stringify(newLeaderboard),
      );

      if (win) {
        const newGrid = prevState.grid.map((array, row) =>
          array.map((num, col) => {
            if (num != null || prevState.flags.has(`${row}-${col}`)) return num;
            const adjacentCells = getAdjacentCells(row, col);
            return (
              adjacentCells.length -
              getAdjacentSafeCells(prevState.bombs, adjacentCells).length
            );
          }),
        );

        return { isActive: false, grid: newGrid };
      } else {
        const newGrid = prevState.grid.map((r) => [...r]);
        toCellCoords([...prevState.bombs]).forEach(({ row, col }) => {
          newGrid[row][col] = -1;
        });
        return { isActive: false, grid: newGrid };
      }
    });
  },
}));
