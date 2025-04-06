import { create, ExtractState } from 'zustand';
import { combine } from 'zustand/middleware';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
  Notes,
} from '@/lib/sudokuTypes';

type SudokuState = ExtractState<typeof useSudokuState>;

export const useSudokuState = create(
  combine(
    {
      seed: 0,
      isActive: false,
      time: 0,
      difficulty: 'easy' as Difficulty,
      originalGrid: [] as Grid,
      solvedGrid: [] as Grid,
      grid: [] as Grid,
      notes: {} as Notes,
      history: [] as HistoryEntry[],
      errors: [] as string[],
      selectedNumber: -1,
      isPencilMode: false,
      leaderboard: [] as LeaderboardEntry[],
    },
    (set) => ({
      setState: (
        state:
          | Partial<SudokuState>
          | ((state: SudokuState) => Partial<SudokuState>),
      ) => set(state),
    }),
  ),
);
