import seedrandom from 'seedrandom';
import { create } from 'zustand';
import { formatTime, getGamesData, saveGameData } from '@/lib/utils';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
} from '@/minesweeper/types';
import {
  generateMinesweeper,
  getAdjacentCells,
  getAdjacentSafeCells,
  getSafeCells,
  toCellCoords,
} from '@/minesweeper/utils';

export type MinesweeperState = {
  seed: string;
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
  optFlagOnClick: boolean;
  optFlagOnDoubleClick: boolean;
  optFlagOnLongClick: boolean;
  optFlagOnRightClick: boolean;
  usedHints: number;
  leaderboard: LeaderboardEntry[];
  setState: (
    newState:
      | Partial<MinesweeperState>
      | ((state: MinesweeperState) => Partial<MinesweeperState>),
  ) => void;
  reset: (difficulty: Difficulty) => void;
  update: (row: number, col: number, isFlagMode: boolean) => void;
  stop: (win: boolean) => void;
};

export const useMinesweeperState = create<MinesweeperState>((set) => ({
  seed: '',
  isActive: false,
  time: 0,
  difficulty: 'easy' as Difficulty,
  dimensions: [0, 0] as [number, number],
  numBombs: 0,
  grid: [] as Grid,
  bombs: new Set<string>(),
  flags: new Set<string>(),
  history: [] as HistoryEntry[],
  isFlagMode: false,
  optFlagOnClick: false,
  optFlagOnDoubleClick: true,
  optFlagOnLongClick: true,
  optFlagOnRightClick: true,
  usedHints: 0,
  leaderboard: [] as LeaderboardEntry[],

  setState: (
    newState:
      | Partial<MinesweeperState>
      | ((state: MinesweeperState) => Partial<MinesweeperState>),
  ) => set(newState),
  reset: (difficulty: Difficulty) => {
    const newSeed = `${Math.random()}`;
    seedrandom(newSeed, { global: true });
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
      usedHints: 0,
    });
  },
  update: (row: number, col: number, isFlagMode: boolean) => {
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
      if (isFlagMode && prevState.grid[row][col] === undefined) {
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
      for (const { row, col, adjacentBombs } of safeCells) {
        newGrid[row][col] = adjacentBombs;
        newFlags.delete(`${row}-${col}`);
      }

      return { grid: newGrid, flags: newFlags, history: newHistory };
    });
  },
  stop: (win: boolean) => {
    set((prevState) => {
      if (win) {
        const gamesData = getGamesData();
        const prevLeaderboard = (gamesData['minesweeper']?.leaderboard ??
          []) as LeaderboardEntry[];
        const newEntry: LeaderboardEntry = {
          seed: prevState.seed,
          difficulty: prevState.difficulty,
          score: formatTime(prevState.time),
          hints: prevState.usedHints,
          date: new Date().toISOString(),
        };
        const newLeaderboard = [...prevLeaderboard, newEntry];
        newLeaderboard.sort((a, b) => a.score.localeCompare(b.score));
        saveGameData(gamesData, {
          minesweeper: {
            ...gamesData['minesweeper'],
            leaderboard: newLeaderboard,
          },
        });

        const newGrid = prevState.grid.map((array, row) =>
          array.map((number_, col) => {
            if (number_ != undefined || prevState.flags.has(`${row}-${col}`))
              return number_;
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
        for (const { row, col } of toCellCoords([
          ...prevState.bombs,
        ] as string[])) {
          newGrid[row][col] = -1;
        }
        return { isActive: false, isFlagMode: false, grid: newGrid };
      }
    });
  },
}));
