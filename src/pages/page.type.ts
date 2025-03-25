import React from 'react';
import Menu from './Menu';
import Sudoku from './Sudoku';
import Minesweeper from './Minesweeper';

const Page = {
  Menu: {
    name: 'Menu',
    path: '/games',
    element: React.createElement(Menu),
  },
  Sudoku: {
    name: 'Sudoku',
    path: '/games/sudoku',
    element: React.createElement(Sudoku),
  },
  Minesweeper: {
    name: 'Minesweeper',
    path: '/games/minesweeper',
    element: React.createElement(Minesweeper),
  },
} as const;

type Page = (typeof Page)[keyof typeof Page];

export default Page;
