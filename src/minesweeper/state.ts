import seedrandom from 'seedrandom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStatus } from '@/lib/types';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
} from '@/minesweeper/types';
import {
  generateMinesweeper,
  getSafeCells,
  toCellCoords,
} from '@/minesweeper/utils';
import { createDefaultJSONStorage } from '@/lib/utils';

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
  usedHints: boolean;
  leaderboard: LeaderboardEntry[];
  setState: (
    newState:
      | Partial<MinesweeperState>
      | ((state: MinesweeperState) => Partial<MinesweeperState>),
  ) => void;
  tick: () => number;
  reset: (difficulty?: Difficulty, state?: MinesweeperState) => void;
  update: (row: number, col: number, flagMode: boolean) => void;
  stop: (win: boolean) => void;
};

export const useMinesweeperStore = create<MinesweeperState>()(
  persist(
    (set) => ({
      status: 'create',
      seed: '',
      time: 0,
      difficulty: 'beginner',
      dimensions: [0, 0],
      numBombs: 0,
      grid: [] as Grid,
      bombs: new Set(),
      flags: new Set(),
      history: [] as HistoryEntry[],
      flagMode: false,
      optFlagOnClick: false,
      optFlagOnDoubleClick: true,
      optFlagOnLongClick: true,
      optFlagOnRightClick: true,
      optShowRemainingBombs: true,
      optShowTime: true,
      usedHints: false,
      leaderboard: [] as LeaderboardEntry[],
      setState: (newState) => set(newState),
      tick: () => {
        let time: number;
        set((prev) => {
          time = prev.time + 1;
          return { time };
        });
        return time;
      },
      reset: (difficulty, state) => {
        set((prev) => {
          const newSeed = `${Math.random()}`.slice(2);
          seedrandom(newSeed, { global: true });
          const { dimensions, numBombs, puzzle, bombs } = generateMinesweeper(
            difficulty ?? state?.difficulty ?? prev.difficulty,
          );

          const resetState = {
            ...prev,
            status: 'play',
            seed: newSeed,
            time: 0,
            difficulty: difficulty ?? state?.difficulty ?? prev.difficulty,
            dimensions: dimensions,
            numBombs: numBombs,
            grid: puzzle,
            bombs: bombs,
            flags: new Set(),
            history: [],
            usedHints: false,
          } as MinesweeperState;

          return state
            ? {
                ...resetState,
                ...state,
              }
            : resetState;
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
          if (safeCells.length > 0) {
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
          let newGrid = [...prev.grid];
          const newLeaderboard: LeaderboardEntry[] = [...prev.leaderboard];
          if (win) {
            // Add the current game to the leaderboard
            newLeaderboard.push({
              seed: prev.seed,
              difficulty: prev.difficulty,
              time: prev.time,
              usedHints: prev.usedHints,
              date: new Date().toISOString(),
            });
            newLeaderboard.sort((a, b) => a.time - b.time);
          } else {
            // Reveal all bombs
            newGrid = prev.grid.map((r) => [...r]);
            for (const { row, col } of toCellCoords([
              ...prev.bombs,
            ] as string[])) {
              newGrid[row][col] = -1;
            }
          }

          return {
            status: 'finished',
            flagMode: false,
            grid: newGrid,
            leaderboard: newLeaderboard,
          };
        });
      },
    }),
    {
      name: 'jantoom-games-minesweeper',
      storage: createDefaultJSONStorage(),
      version: 0.01,
    },
  ),
);
