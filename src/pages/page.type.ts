import React from 'react';
import Menu from '@/pages/Menu';
import Minesweeper from '@/pages/Minesweeper';
import Sudoku from '@/pages/Sudoku';

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
