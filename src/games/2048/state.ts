import seedrandom from 'seedrandom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
  Notes,
} from '@/games/2048/types';
import { generate2048, getRelatedCells, toCellKeys } from '@/games/2048/utils';
import { GameStatus } from '@/lib/types';
import { createDefaultJSONStorage } from '@/lib/utils';

export type _2048State = {
  status: GameStatus;
  seed: string;
  time: number;
  difficulty: Difficulty;
  originalGrid: Grid;
  solvedGrid: Grid;
  grid: Grid;
  notes: Notes;
  history: HistoryEntry[];
  errors: string[];
  selectedNumber: number;
  pencilMode: boolean;
  optAssistHighlight: boolean;
  optAssistRemaining: boolean;
  optAssistAutoRemove: boolean;
  optShowTime: boolean;
  usedAssistHighlight: boolean;
  usedAssistRemaining: boolean;
  usedAssistAutoRemove: boolean;
  usedHints: boolean;
  leaderboard: LeaderboardEntry[];
  setState: (
    newState:
      | Partial<_2048State>
      | ((state: _2048State) => Partial<_2048State>),
  ) => void;
  tick: () => number;
  reset: (difficulty?: Difficulty, state?: _2048State) => void;
  restart: () => void;
  update: (row: number, col: number, num: number, pencilMode: boolean) => void;
  undo: () => void;
  stop: (win: boolean) => void;
};

export const use2048Store = create<_2048State>()(
  persist(
    (set) => ({
      status: 'create',
      seed: '',
      time: 0,
      difficulty: 'beginner',
      originalGrid: [] as Grid,
      solvedGrid: [] as Grid,
      grid: [] as Grid,
      notes: {} as Notes,
      history: [] as HistoryEntry[],
      errors: [] as string[],
      selectedNumber: undefined as number,
      pencilMode: false,
      optAssistHighlight: true,
      optAssistRemaining: true,
      optAssistAutoRemove: true,
      optShowTime: true,
      usedAssistHighlight: false,
      usedAssistRemaining: false,
      usedAssistAutoRemove: false,
      usedHints: false,
      leaderboard: [] as LeaderboardEntry[],
      setState: (state) => set(state),
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
          const { puzzle, solution } = generate2048(
            difficulty ?? state?.difficulty ?? prev.difficulty,
          );

          const resetState = {
            ...prev,
            status: 'play',
            seed: newSeed,
            time: 0,
            difficulty: difficulty ?? state?.difficulty ?? prev.difficulty,
            originalGrid: puzzle.map((row) => [...row]),
            solvedGrid: solution,
            grid: puzzle,
            notes: Object.fromEntries(
              Array.from({ length: 9 }).flatMap((_, row) =>
                Array.from({ length: 9 }).map((_, col) => [
                  `${row}-${col}`,
                  new Set<number>(),
                ]),
              ),
            ),
            history: [],
            errors: [],
            selectedNumber: undefined,
            pencilMode: false,
            usedAssistHighlight: false,
            usedAssistRemaining: false,
            usedAssistAutoRemove: false,
            usedHints: false,
          } as _2048State;

          return state
            ? {
                ...resetState,
                ...state,
              }
            : resetState;
        });
      },
      restart: () => {
        set((prev) => ({
          grid: prev.originalGrid.map((row) => [...row]),
          notes: Object.fromEntries(
            Array.from({ length: 9 }).flatMap((_, row) =>
              Array.from({ length: 9 }).map((_, col) => [
                `${row}-${col}`,
                new Set<number>(),
              ]),
            ),
          ),
          history: [],
          errors: [],
          selectedNumber: undefined,
          pencilMode: false,
        }));
      },
      update: (row, col, num, pencilMode) => {
        set((prev) => {
          if (prev.status !== 'play') return {};

          const newHistory = [
            ...prev.history,
            {
              grid: prev.grid.map((row) => [...row]),
              notes: Object.fromEntries(
                Object.entries(prev.notes).map(([key, value]) => [
                  key,
                  new Set(value),
                ]),
              ),
            },
          ];

          const newNotes = { ...prev.notes };
          if (num !== 0) {
            const affectedCells = pencilMode
              ? [`${row}-${col}`]
              : prev.optAssistAutoRemove
                ? toCellKeys(getRelatedCells(row, col))
                : [];
            for (const key of affectedCells) {
              newNotes[key] = new Set(prev.notes[key]);
              if (newNotes[key].has(num)) {
                newNotes[key].delete(num);
              } else if (pencilMode) {
                newNotes[key].add(num);
              }
            }
          }
          if (!pencilMode || num === 0) {
            newNotes[`${row}-${col}`] = new Set();
          }

          const newGrid = prev.grid.map((r) => [...r]);
          newGrid[row][col] =
            prev.grid[row][col] !== num && !pencilMode ? num : 0;

          return { grid: newGrid, notes: newNotes, history: newHistory };
        });
      },
      undo: () => {
        set((prev) => {
          if (prev.status !== 'play') return {};

          const lastStep = prev.history.at(-1);
          return lastStep === undefined
            ? {}
            : {
                grid: lastStep.grid.map((row) => [...row]),
                notes: Object.fromEntries(
                  Object.entries(lastStep.notes).map(([key, value]) => [
                    key,
                    new Set(value),
                  ]),
                ),
                history: prev.history.slice(0, -1),
              };
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
              usedAssists: [
                prev.usedAssistHighlight || prev.optAssistHighlight,
                prev.usedAssistRemaining || prev.optAssistRemaining,
                prev.usedAssistAutoRemove || prev.optAssistAutoRemove,
              ],
              usedHints: prev.usedHints,
              date: new Date().toISOString(),
              time: prev.time,
            });
            newLeaderboard.sort((a, b) => a.time - b.time);
          }

          return {
            status: 'finished',
            pencilMode: false,
            selectedNumber: undefined,
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
