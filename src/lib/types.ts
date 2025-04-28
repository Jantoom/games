import { MinesweeperState } from '@/minesweeper/state';
import { SudokuState } from '@/sudoku/state';
import { GlobalState } from './state';

export const pagePaths = [
  'menu',
  'create',
  'play',
  'settings',
  'leaderboard',
] as const;
export type PagePath = (typeof pagePaths)[number];
export const games = ['sudoku', 'minesweeper'] as const;
export type Game = (typeof games)[number];
export const gameStatuses = ['create', 'play', 'paused', 'finished'] as const;
export type GameStatus = (typeof gameStatuses)[number];
export type GamesData = {
  global: GlobalState;
  sudoku: SudokuState;
  minesweeper: MinesweeperState;
};
export interface BaseState {
  status: GameStatus;
  seed: string;
}