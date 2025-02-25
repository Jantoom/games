
export type Mode = 'default' | 'pencil';
export type CellNotes = Set<number>;
export type Notes = { [key: string]: CellNotes };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Theme = 'dark-blue' | 'light-blue' | 'dark-red' | 'light-red';

export interface GridHistory {
  grid: number[][];
  notes: Notes;
}

export interface LeaderboardEntry {
  difficulty: Difficulty;
  time: number;
  date: string;
}
