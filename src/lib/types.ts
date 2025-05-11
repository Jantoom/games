import { _2048State } from '@/games/2048/state';
import { MinesweeperState } from '@/games/minesweeper/state';
import { SudokuState } from '@/games/sudoku/state';
import { GlobalState } from '@/lib/state';

export const pagePaths = [
  'menu',
  'create',
  'play',
  'settings',
  'leaderboard',
] as const;
export type PagePath = (typeof pagePaths)[number];
export const games = ['sudoku', 'minesweeper', '2048'] as const;
export type Game = (typeof games)[number];
export const gameStatuses = ['create', 'play', 'paused', 'finished'] as const;
export type GameStatus = (typeof gameStatuses)[number];
export type GamesData = {
  global: GlobalState;
  sudoku: SudokuState;
  minesweeper: MinesweeperState;
  '2048': _2048State;
};
export interface BaseState {
  status: GameStatus;
  seed: string;
}