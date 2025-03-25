export type Grid = number[][];
export type CellNotes = Set<number>;
export type Notes = { [cell: string]: CellNotes };
export type HistoryEntry = {
  grid: Grid;
  notes: Notes;
};

export type Difficulty = 'easy' | 'medium' | 'hard';
export type LeaderboardEntry = {
  difficulty: Difficulty;
  time: number;
  seed: number;
  date: string;
};
