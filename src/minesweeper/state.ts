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
import { GameStatus } from '@/lib/types';

export type MinesweeperState = {
  status: GameStatus;
  seed: string;
  time: number;
  difficulty: Difficulty;
  dimensions: [number, number];
  numBombs: number;
  grid: Grid;
  bombs: Set<string>;
  flags: Set<string>;
  history: HistoryEntry[];
  flagMode: boolean;
  optFlagOnClick: boolean;
  optFlagOnDoubleClick: boolean;
  optFlagOnLongClick: boolean;
  optFlagOnRightClick: boolean;
  optShowRemainingBombs: boolean;
  optShowTime: boolean;
  usedHints: number;
  leaderboard: LeaderboardEntry[];
  setState: (
    newState:
      | Partial<MinesweeperState>
      | ((state: MinesweeperState) => Partial<MinesweeperState>),
  ) => void;
  tick: () => number;
  reset: (difficulty?: Difficulty) => void;
  update: (row: number, col: number, flagMode: boolean) => void;
  stop: (win: boolean) => void;
};

export const useMinesweeperState = create<MinesweeperState>((set) => ({
  status: undefined,
  seed: '',
  time: 0,
  difficulty: 'easy',
  dimensions: [0, 0],
  numBombs: 0,
  grid: [],
  bombs: new Set(),
  flags: new Set(),
  history: [],
  flagMode: false,
  optFlagOnClick: false,
  optFlagOnDoubleClick: true,
  optFlagOnLongClick: true,
  optFlagOnRightClick: true,
  optShowRemainingBombs: true,
  optShowTime: true,
  usedHints: 0,
  leaderboard: [],
  setState: (newState) => set(newState),
  tick: () => {
    let time: number = undefined;
    set((prev) => {
      time = prev.time + 1;
      return { time };
    });
    return time;
  },
  reset: (difficulty = 'easy') => {
    const newSeed = `${Math.random()}`;
    console.log(difficulty)
    seedrandom(newSeed, { global: true });
    const { dimensions, numBombs, puzzle, bombs } =
      generateMinesweeper(difficulty);

    set({
      status: 'play',
      seed: newSeed,
      time: 0,
      difficulty: difficulty,
      dimensions: dimensions,
      numBombs: numBombs,
      grid: puzzle,
      bombs: bombs,
      flags: new Set(),
      history: [],
      usedHints: 0,
    });
  },
  update: (row, col, flagMode) => {
    set((prev) => {
      if (prev.status !== 'play') return {};

      const newHistory = [
        ...prev.history,
        {
          grid: prev.grid.map((row) => [...row]),
          flags: new Set(prev.flags),
        },
      ];

      const newFlags = new Set(prev.flags);
      if (flagMode) {
        if (prev.grid[row][col] != undefined) return {};

        if (newFlags.has(`${row}-${col}`)) {
          newFlags.delete(`${row}-${col}`);
        } else {
          newFlags.add(`${row}-${col}`);
        }
        return { flags: newFlags, history: newHistory };
      }

      const newGrid = prev.grid.map((r) => [...r]);
      const safeCells = getSafeCells(prev.bombs, row, col);
      if (safeCells.length !== 0) {
        for (const { row, col, adjacentBombs } of safeCells) {
          newGrid[row][col] = adjacentBombs;
          newFlags.delete(`${row}-${col}`);
        }
        return { grid: newGrid, flags: newFlags, history: newHistory };
      }

      prev.stop(false);
      return {};
    });
  },
  stop: (win) => {
    set((prev) => {
      let newGrid: Grid = undefined;
      if (!win) {
        newGrid = prev.grid.map((r) => [...r]);
        for (const { row, col } of toCellCoords([...prev.bombs] as string[])) {
          newGrid[row][col] = -1;
        }
      } else {
        const gamesData = getGamesData();
        const prevLeaderboard = (gamesData['minesweeper']?.leaderboard ??
          []) as LeaderboardEntry[];
        const newEntry: LeaderboardEntry = {
          seed: prev.seed,
          difficulty: prev.difficulty,
          score: formatTime(prev.time),
          hints: prev.usedHints,
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

        newGrid = prev.grid.map((array, row) =>
          array.map((num, col) => {
            if (num != undefined || prev.flags.has(`${row}-${col}`)) return num;
            const adjacentCells = getAdjacentCells(row, col);
            return (
              adjacentCells.length -
              getAdjacentSafeCells(prev.bombs, adjacentCells).length
            );
          }),
        );
      }

      return { status: 'finished', flagMode: false, grid: newGrid };
    });
  },
}));
