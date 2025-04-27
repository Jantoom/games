import React from 'react';
import Menu from '@/menu/Menu';
import {
  MinesweeperCreate,
  MinesweeperLeaderboard,
  MinesweeperPlay,
  MinesweeperSettings,
} from '@/minesweeper/Minesweeper';
import { SudokuCreate, SudokuLeaderboard, SudokuPlay, SudokuSettings } from './sudoku/Sudoku';

const Page = {
  Menu: {
    name: 'Menu',
    path: '/games',
    element: React.createElement(Menu),
  },
  SudokuCreate: {
    name: 'SudokuCreate',
    path: '/games/sudoku/create',
    element: React.createElement(SudokuCreate),
  },
  SudokuPlay: {
    name: 'SudokuPlay',
    path: '/games/sudoku/play',
    element: React.createElement(SudokuPlay),
  },
  SudokuSettings: {
    name: 'SudokuSettings',
    path: '/games/sudoku/settings',
    element: React.createElement(SudokuSettings),
  },
  SudokuLeaderboard: {
    name: 'SudokuLeaderboard',
    path: '/games/sudoku/leaderboard',
    element: React.createElement(SudokuLeaderboard),
  },
  MinesweeperCreate: {
    name: 'Minesweeper',
    path: '/games/minesweeper/create',
    element: React.createElement(MinesweeperCreate),
  },
  MinesweeperPlay: {
    name: 'Minesweeper',
    path: '/games/minesweeper/play',
    element: React.createElement(MinesweeperPlay),
  },
  MinesweeperSettings: {
    name: 'Minesweeper',
    path: '/games/minesweeper/settings',
    element: React.createElement(MinesweeperSettings),
  },
  MinesweeperLeaderboard: {
    name: 'Minesweeper',
    path: '/games/minesweeper/leaderboard',
    element: React.createElement(MinesweeperLeaderboard),
  },
} as const;

type Page = (typeof Page)[keyof typeof Page];

export default Page;
