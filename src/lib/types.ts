import { MinesweeperState } from '@/minesweeper/state';
import { SudokuState } from '@/sudoku/state';
import { GlobalState } from './state';

export const gameStatuses = ['create', 'play', 'paused', 'finished'] as const;
export type GameStatus = (typeof gameStatuses)[number];
export enum PageDepth {
  Menu = 0,
  Create = 1,
  Play = 2,
}
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
