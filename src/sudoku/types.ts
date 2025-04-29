export const difficulties = ['beginner', 'easy', 'medium', 'hard', 'extreme'] as const;
export type Difficulty = (typeof difficulties)[number];
export type Grid = number[][];
export type CellNotes = Set<number>;
export type Notes = { [cell: string]: CellNotes };
export type HistoryEntry = {
  grid: Grid;
  notes: Notes;
};
export type LeaderboardEntry = {
  seed: string;
  difficulty: Difficulty;
  hints: boolean[];
  date: string;
  time: number;
};
