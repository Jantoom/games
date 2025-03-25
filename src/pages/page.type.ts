import React from 'react';
import Menu from './Menu';
import Sudoku from './Sudoku';

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
} as const;

type Page = (typeof Page)[keyof typeof Page];

export default Page;
