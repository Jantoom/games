export const difficulties = ['4x4', '5x5'] as const;
export type Difficulty = (typeof difficulties)[number];
export const directions = ['up', 'down', 'left', 'right'] as const;
export type Direction = (typeof directions)[number];
export type Cell = {
  id: number;
  row: number;
  col: number;
  value: number;
};
export type LeaderboardEntry = {
  seed: string;
  difficulty: Difficulty;
  date: string;
  score: number;
};
