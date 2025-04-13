import React from 'react';
import Menu from '@/menu/Menu';
import { MinesweeperCreate, MinesweeperPlay } from '@/minesweeper/Minesweeper';
import { SudokuCreate, SudokuPlay } from './sudoku/Sudoku';

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
} as const;

type Page = (typeof Page)[keyof typeof Page];

export default Page;
