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
export interface BaseState {
  status: GameStatus;
  seed: string;
  setState: (
    newState:
      | Partial<BaseState>
      | ((state: BaseState) => Partial<BaseState>),
  ) => void;
  read: () => BaseState | undefined;
  save: () => void;
}