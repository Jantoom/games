import { MinesweeperState } from '@/minesweeper/state';
import { SudokuState } from '@/sudoku/state';
import { GlobalState } from './state';

export const gameStatuses = ['create', 'play', 'paused', 'finished'] as const;
export type GameStatus = (typeof gameStatuses)[number];
export const pagePaths = [
  'menu',
  'create',
  'play',
  'settings',
  'leaderboard',
] as const;
export type PagePath = (typeof pagePaths)[number];
export type GamesData = {
  global: GlobalState;
  sudoku: SudokuState;
  minesweeper: MinesweeperState;
};
export class SerializableSet<T> extends Set<T> {
  constructor(iterable?: Iterable<T>) {
    super(iterable);
  }
  toJSON() {
    return [...this];
  }
  static from<T>(array: T[]) {
    return new SerializableSet(array);
  }

  static fromJSON<U>(data: U[]): SerializableSet<U> {
    return new SerializableSet(data);
  }
}
