import React from 'react';
import Menu from '@/components/Menu';
import {
  MinesweeperCreate,
  MinesweeperLeaderboard,
  MinesweeperPlay,
  MinesweeperSettings,
} from '@/games/minesweeper/Minesweeper';
import {
  SudokuCreate,
  SudokuLeaderboard,
  SudokuPlay,
  SudokuSettings,
} from '@/games/sudoku/Sudoku';
import {
  _2048Create,
  _2048Leaderboard,
  _2048Play,
  _2048Settings,
} from './games/2048/2048';

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
  '2048Create': {
    name: '2048Create',
    path: '/games/2048/create',
    element: React.createElement(_2048Create),
  },
  '2048Play': {
    name: '2048Play',
    path: '/games/2048/play',
    element: React.createElement(_2048Play),
  },
  '2048Settings': {
    name: '2048Settings',
    path: '/games/2048/settings',
    element: React.createElement(_2048Settings),
  },
  '2048Leaderboard': {
    name: '2048Leaderboard',
    path: '/games/2048/leaderboard',
    element: React.createElement(_2048Leaderboard),
  },
} as const;

type Page = (typeof Page)[keyof typeof Page];

export default Page;
