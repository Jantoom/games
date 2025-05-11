import seedrandom from 'seedrandom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Cell,
  Difficulty,
  Direction,
  LeaderboardEntry,
} from '@/games/2048/types';
import {
  generate2048,
  getNewCell,
  getTranslatedCells,
  cellsEqual,
} from '@/games/2048/utils';
import { GameStatus } from '@/lib/types';
import { createDefaultJSONStorage } from '@/lib/utils';

export type _2048State = {
  status: GameStatus;
  seed: string;
  score: number;
  difficulty: Difficulty;
  dimensions: [number, number];
  cells: Cell[];
  optShowScore: boolean;
  leaderboard: LeaderboardEntry[];
  setState: (
    newState:
      | Partial<_2048State>
      | ((state: _2048State) => Partial<_2048State>),
  ) => void;
  reset: (difficulty?: Difficulty, state?: _2048State) => void;
  update: (direction: Direction) => void;
  stop: (win: boolean) => void;
};

export const use2048Store = create<_2048State>()(
  persist(
    (set) => ({
      status: 'create',
      seed: '',
      score: 0,
      difficulty: '4x4',
      dimensions: [0, 0],
      cells: [] as Cell[],
      optShowScore: true,
      leaderboard: [] as LeaderboardEntry[],
      setState: (state) => set(state),
      reset: (difficulty, state) => {
        set((prev) => {
          const newSeed = `${Math.random()}`.slice(2);
          seedrandom(newSeed, { global: true });
          const { dimensions, cells } = generate2048(
            difficulty ?? state?.difficulty ?? prev.difficulty,
          );

          const resetState = {
            ...prev,
            status: 'play',
            seed: newSeed,
            score: 0,
            difficulty: difficulty ?? state?.difficulty ?? prev.difficulty,
            dimensions: dimensions,
            cells: cells,
          } as _2048State;

          return state
            ? {
                ...resetState,
                ...state,
              }
            : resetState;
        });
      },
      update: (direction) => {
        set((prev) => {
          if (prev.status !== 'play') return {};

          const [newCells, mergeScore] = getTranslatedCells(
            prev.cells,
            direction,
          );
          if (!cellsEqual(newCells, prev.cells)) {
            // New cell should appear beneath moving cells, since it is an after effect.
            // At start of list should render it first, therefore beneath existing cells.
            newCells.unshift(getNewCell(newCells));
          }

          return { cells: newCells, score: prev.score + mergeScore };
        });
      },
      stop: (win) => {
        set((prev) => {
          const newLeaderboard: LeaderboardEntry[] = [...prev.leaderboard];
          if (win) {
            // Add the current game to the leaderboard
            newLeaderboard.push({
              seed: prev.seed,
              difficulty: prev.difficulty,
              date: new Date().toISOString(),
              score: prev.score,
            });
            newLeaderboard.sort((a, b) => a.score - b.score);
          }

          return {
            status: 'finished',
            leaderboard: newLeaderboard,
          };
        });
      },
    }),
    {
      name: 'jantoom-games-2048',
      storage: createDefaultJSONStorage(),
      version: 0.01,
    },
  ),
);
