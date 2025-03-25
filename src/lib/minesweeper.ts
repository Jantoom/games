import { Difficulty, Grid, Notes } from './sudokuTypes';

let cellCoords: { row: number; col: number }[] = [...Array(9)].flatMap(
  (_, row) => [...Array(9)].map((_, col) => ({ row, col })),
);
let dimensions: { row: number; col: number } = { row: 15, col: 10 };
let numBombs: number = 15;

export const generateMinesweeper = (
  difficulty: Difficulty,
): { puzzle: Grid; solution: Grid } => {
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

  const solution = Array(dimensions.row)
    .fill(null)
    .map(() => Array(dimensions.col).fill(-1));

  const puzzle = Array(dimensions.row)
    .fill(null)
    .map(() => Array(dimensions.col).fill(-1));

  let count = 0;
  while (count < numBombs) {
    const row = Math.floor(Math.random() * dimensions.row);
    const col = Math.floor(Math.random() * dimensions.col);
    if (solution[row][col] != 9) {
      solution[row][col] = 9;
      count++;
    }
  }

  solution.forEach((array, row) =>
    array.forEach((cell, col) => {
      solution[row][col] =
        cell === 9
          ? 9
          : getAdjacentCells(row, col).filter(
              ({ row, col }) => solution[row][col] === 9,
            ).length;
    }),
  );

  return { puzzle, solution };
};

export const isSolved = (grid: Grid): boolean =>
  grid.flat().every((num) => num != -1);

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

export const getSafeCells = (
  solution: Grid,
  row: number,
  col: number,
): { row: number; col: number }[] => {
  if (solution[row][col] === 9) return []; // If the starting cell is a bomb, return empty list

  const result: { row: number; col: number }[] = [];
  const queue: { row: number; col: number }[] = [{ row, col }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { row, col } = queue.shift()!;
    const key = `${row},${col}`;

    if (visited.has(key)) continue;

    visited.add(key);
    result.push({ row, col });

    // Expand if no adjacent bombs
    if (solution[row][col] === 0) {
      for (const { row: y, col: x } of getAdjacentCells(row, col)) {
        if (solution[y][x] !== 9) queue.push({ row: y, col: x });
      }
    }
  }

  return result;
};
