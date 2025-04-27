export const difficulties = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof difficulties)[number];
export type Grid = number[][];
export type HistoryEntry = {
  grid: Grid;
};
export type LeaderboardEntry = {
  seed: string;
  difficulty: Difficulty;
  time: number;
  usedHints: boolean;
  date: string;
};
