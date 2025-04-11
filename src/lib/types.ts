export const gameStatuses = [
  'setup',
  'play',
  'paused',
  'finished',
] as const;
export type GameStatus = (typeof gameStatuses)[number];
export type GamesData = {
  sudoku?: object;
  minesweeper?: object;
  solitaire?: object;
  snake?: object;
  pong?: object;
  '2048'?: object;
};