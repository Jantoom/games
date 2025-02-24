
export type CellNotes = Set<number>;
export type Notes = { [key: string]: CellNotes };
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GridHistory {
  grid: number[][];
  notes: Notes;
}
