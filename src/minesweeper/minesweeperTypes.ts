export const difficulties = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof difficulties)[number];
export type Grid = number[][];
export type HistoryEntry = {
  grid: Grid;
};
export type LeaderboardEntry = {
  difficulty: Difficulty;
  hints: number;
  score: string;
  seed: string;
  date: string;
};
