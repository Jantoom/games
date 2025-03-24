import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
  Notes,
} from "@/lib/types";
import { create } from "zustand";

interface SudokuState {
  seed: number;
  isActive: boolean;
  time: number;
  difficulty: Difficulty;
  originalGrid: Grid;
  solvedGrid: Grid;
  grid: Grid;
  notes: Notes;
  history: HistoryEntry[];
  errors: string[];
  selectedNumber: number | null;
  isPencilMode: boolean;
  leaderboard: LeaderboardEntry[];
  setState: (state: Partial<SudokuState> | ((state: SudokuState) => Partial<SudokuState>)) => void;
}

export const useSudokuState = create<SudokuState>((set) => ({
  seed: 0,
  isActive: false,
  time: 0,
  difficulty: "easy",
  originalGrid: [],
  solvedGrid: [],
  grid: [],
  notes: {},
  history: [],
  errors: [],
  selectedNumber: null,
  isPencilMode: false,
  leaderboard: [],
  setState: (newState) => set(newState),
}));
