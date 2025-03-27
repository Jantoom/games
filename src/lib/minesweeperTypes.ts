export type Difficulty = 'easy' | 'medium' | 'hard';
export type Grid = number[][];
export type HistoryEntry = {
  grid: Grid;
};
export type LeaderboardEntry = {
  difficulty: Difficulty;
  time: number;
  seed: number;
  date: string;
};