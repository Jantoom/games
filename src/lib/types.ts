export const gameStatuses = ['setup', 'play', 'paused', 'finished'] as const;
export type GameStatus = (typeof gameStatuses)[number];
export type GamesData = {
  sudoku?: object;
  minesweeper?: object;
  solitaire?: object;
  snake?: object;
  pong?: object;
  '2048'?: object;
};
export enum PageDepth {
  Menu = 0,
  Create = 1,
  Play = 2,
}
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
