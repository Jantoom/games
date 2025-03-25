import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
} from '@/lib/minesweeperTypes';
import { create } from 'zustand';

interface MinesweeperState {
  seed: number;
  isActive: boolean;
  time: number;
  difficulty: Difficulty;
  originalGrid: Grid;
  solvedGrid: Grid;
  grid: Grid;
  history: HistoryEntry[];
  leaderboard: LeaderboardEntry[];
  setState: (
    state:
      | Partial<MinesweeperState>
      | ((state: MinesweeperState) => Partial<MinesweeperState>),
  ) => void;
}

export const useMinesweeperState = create<MinesweeperState>((set) => ({
  seed: 0,
  isActive: false,
  time: 0,
  difficulty: 'easy',
  originalGrid: [],
  solvedGrid: [],
  grid: [],
  history: [],
  leaderboard: [],
  setState: (newState) => set(newState),
}));
