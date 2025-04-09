import { shuffle } from '@/lib/utils';
import { Difficulty, Grid, Notes } from '@/sudoku/types';

const cellCoords: { row: number; col: number }[] = Array.from({
  length: 9,
}).flatMap((_, row) =>
  Array.from({ length: 9 }).map((_, col) => ({ row, col })),
);

const fillGrid = (grid: Grid): boolean => {
  const emptyCell =
    cellCoords.find(({ row, col }) => grid[row][col] === 0) || undefined;
  if (!emptyCell) return true;

  const { row, col } = emptyCell;
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const number_ of nums) {
    if (isValidCell(grid, row, col, number_)) {
      grid[row][col] = number_;
      if (fillGrid(grid)) return true;
      grid[row][col] = 0;
    }
  }

  return false;
};

const isValidCell = (
  grid: Grid,
  row: number,
  col: number,
  number_: number,
): boolean =>
  [{ row, col }, ...getRelatedCells(row, col)].every(
    ({ row, col }) => grid[row][col] !== number_,
  );

const toUniqueCells = (
  cells: { row: number; col: number }[],
): { row: number; col: number }[] =>
  toCellCoords([...new Set(toCellKeys(cells))] as string[]);

export const generateSudoku = (
  difficulty: Difficulty,
): { puzzle: Grid; solution: Grid } => {
  // First, generate a solved grid
  const solution = Array.from({ length: 9 }).map(() =>
    Array.from({ length: 9 }).fill(0),
  ) as Grid;
  fillGrid(solution);

  // Then remove numbers based on difficulty
  const numberToRemove = {
    easy: 35,
    medium: 45,
    hard: 55,
  }[difficulty];

  const puzzle = solution.map((row) => [...row]);
  let count = 0;
  while (count < numberToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      count++;
    }
  }

  return { puzzle, solution };
};

export const isSolved = (grid: Grid): boolean =>
  getMatchingCells(grid, 0).length === 0 && getConflictCells(grid).length === 0;

export const getMatchingCells = (
  grid: Grid,
  number_: number,
): { row: number; col: number }[] =>
  cellCoords.filter(({ row, col }) => grid[row][col] === number_);

export const getRelatedCells = (
  row: number,
  col: number,
): { row: number; col: number }[] =>
  cellCoords.filter(
    ({ row: y, col: x }) =>
      (y !== row || x !== col) &&
      (y === row ||
        x === col ||
        (Math.floor(y / 3) === Math.floor(row / 3) &&
          Math.floor(x / 3) === Math.floor(col / 3))),
  );

export const getHintCells = (
  grid: Grid,
  notes: Notes,
  solvedGrid: Grid,
): { row: number; col: number }[] =>
  cellCoords
    .filter(
      ({ row, col }) =>
        notes[`${row}-${col}`].size === 0 && grid[row][col] === 0,
    )
    .falsyIfEmpty() ||
  cellCoords
    .filter(({ row, col }) => notes[`${row}-${col}`].size > 0)
    .falsyIfEmpty() ||
  getMismatchCells(grid, solvedGrid);

export const getConflictCells = (grid: Grid): { row: number; col: number }[] =>
  toUniqueCells(
    cellCoords.flatMap(({ row, col }) =>
      getRelatedCells(row, col).filter(
        ({ row: y, col: x }) =>
          grid[row][col] !== 0 && grid[row][col] === grid[y][x],
      ),
    ),
  );

export const getMismatchCells = (
  grid: Grid,
  solvedGrid: Grid,
): { row: number; col: number }[] =>
  cellCoords.filter(
    ({ row, col }) =>
      grid[row][col] !== 0 && grid[row][col] !== solvedGrid[row][col],
  );

export const getAutoNotes = (grid: Grid): Notes =>
  cellCoords
    .filter(({ row, col }) => grid[row][col] === 0)
    .map(({ row, col }): [string, Set<number>] => [
      `${row}-${col}`,
      new Set(
        [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number_) =>
          isValidCell(grid, row, col, number_),
        ),
      ),
    ])
    .toObject();

export const toCellKeys = (cells: { row: number; col: number }[]): string[] =>
  cells.map(({ row, col }) => `${row}-${col}`);

export const toCellCoords = (cells: string[]): { row: number; col: number }[] =>
  cells.map((cell) => {
    const [row, col] = cell.split('-').map(Number) as [number, number];
    return { row, col };
  });
