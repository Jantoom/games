import { Difficulty, Grid } from './minesweeperTypes';

let cellCoords: { row: number; col: number }[] = [...Array(9)].flatMap(
  (_, row) => [...Array(9)].map((_, col) => ({ row, col })),
);
let dimensions: { row: number; col: number } = { row: 15, col: 10 };
let numBombs: number = 15;

export const generateMinesweeper = (
  difficulty: Difficulty,
): {
  dimensions: [number, number];
  numBombs: number;
  puzzle: Grid;
  bombs: Set<string>;
} => {
  // First, prepare based on difficulty
  dimensions = {
    easy: { row: 12, col: 8 },
    medium: { row: 21, col: 14 },
    hard: { row: 30, col: 20 },
  }[difficulty];

  numBombs = {
    easy: 12,
    medium: 36,
    hard: 72,
  }[difficulty];

  // Then generate grids and add bombs based on difficulty
  cellCoords = [...Array(dimensions.row)].flatMap((_, row) =>
    [...Array(dimensions.col)].map((_, col) => ({ row, col })),
  );

  const puzzle = Array(dimensions.row)
    .fill(null)
    .map(() => Array(dimensions.col).fill(null));

  const bombs = new Set<string>();

  let count = 0;
  while (count < numBombs) {
    const row = Math.floor(Math.random() * dimensions.row);
    const col = Math.floor(Math.random() * dimensions.col);
    if (!bombs.has(`${row}-${col}`)) {
      bombs.add(`${row}-${col}`);
      count++;
    }
  }

  return {
    dimensions: [dimensions.row, dimensions.col],
    numBombs,
    puzzle,
    bombs,
  };
};

export const isSolved = (bombs: Set<string>, flags: Set<string>): boolean =>
  bombs.size > 0 &&
  bombs.size === flags.size &&
  [...bombs].every((bomb) => flags.has(bomb));

export const getAdjacentCells = (
  row: number,
  col: number,
): { row: number; col: number }[] =>
  [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]
    .map(([dy, dx]) => ({ row: row + dy, col: col + dx }))
    .filter(
      ({ row: y, col: x }) =>
        y > -1 &&
        y < dimensions.row &&
        x > -1 &&
        x < dimensions.col &&
        !(row === y && col === x),
    );

export const getAdjacentSafeCells = (
  bombs: Set<string>,
  adjacentCells: { row: number; col: number }[],
): { row: number; col: number }[] =>
  toCellCoords(toCellKeys(adjacentCells).filter((key) => !bombs.has(key)));

export const getSafeCells = (
  bombs: Set<string>,
  row: number,
  col: number,
): { row: number; col: number; adjacentBombs: number }[] => {
  if (bombs.has(`${row}-${col}`)) return []; // If the starting cell is a bomb, return empty list

  const result: { row: number; col: number; adjacentBombs: number }[] = [];
  const queue: { row: number; col: number }[] = [{ row, col }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { row, col } = queue.shift()!;
    const key = `${row}-${col}`;

    if (visited.has(key)) continue;

    visited.add(key);

    const adjacentCells = getAdjacentCells(row, col);
    const adjacentSafeCells = getAdjacentSafeCells(bombs, adjacentCells);
    const adjacentBombs = adjacentCells.length - adjacentSafeCells.length;

    result.push({ row, col, adjacentBombs });

    // Expand if no adjacent bombs
    if (!adjacentBombs) {
      adjacentSafeCells.forEach(({ row, col }) => {
        queue.push({ row, col });
      });
    }
  }

  return result;
};

export const getHintCells = (
  grid: Grid,
  bombs: Set<string>,
): { row: number; col: number }[] =>
  cellCoords.filter(
    ({ row, col }) => grid[row][col] === null && !bombs.has(`${row}-${col}`),
  );

export const toCellKeys = (cells: { row: number; col: number }[]): string[] =>
  cells.map(({ row, col }) => `${row}-${col}`);

export const toCellCoords = (cells: string[]): { row: number; col: number }[] =>
  cells.map((cell) => {
    const [row, col] = cell.split('-').map(Number);
    return { row, col };
  });
