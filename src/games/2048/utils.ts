import { Difficulty, directions, Cell, Direction } from '@/games/2048/types';

const difficultyConfig: Record<
  Difficulty,
  { numRows: number; numCols: number }
> = {
  '4x4': { numRows: 4, numCols: 4 },
  '5x5': { numRows: 5, numCols: 5 },
};

let config: { numRows: number; numCols: number } = difficultyConfig['4x4'];
let cellCoords: { row: number; col: number }[] = Array.from({
  length: config.numRows,
}).flatMap((_, row) =>
  Array.from({ length: config.numCols }).map((_, col) => ({ row, col })),
);

export const generate2048 = (
  difficulty: Difficulty,
): { dimensions: [number, number]; cells: Cell[] } => {
  config = difficultyConfig[difficulty];
  cellCoords = Array.from({ length: config.numRows }).flatMap((_, row) =>
    Array.from({ length: config.numCols }).map((_, col) => ({ row, col })),
  );

  const cell = getNewCell([]);

  return { dimensions: [config.numRows, config.numCols], cells: [cell] };
};

export const isFinished = (grid: Cell[]): boolean => {
  return directions.every((direction) => {
    const [moved, _] = getTranslatedCells(grid, direction);
    return cellsEqual(grid, moved);
  });
};

export const cellsEqual = (gridA: Cell[], gridB: Cell[]): boolean => {
  if (gridA.length !== gridB.length) return false;

  const sortCells = (grid: Cell[]) =>
    [...grid].sort((a, b) => a.row - b.row || a.col - b.col);

  const aSorted = sortCells(gridA);
  const bSorted = sortCells(gridB);

  for (let i = 0; i < aSorted.length; i++) {
    const a = aSorted[i];
    const b = bSorted[i];
    if (a.row !== b.row || a.col !== b.col || a.value !== b.value) {
      return false;
    }
  }

  return true;
};

export const getNewCell = (cells: Cell[]): Cell => {
  const emptyCells = cellCoords.filter(
    ({ row, col }) =>
      cells.values().find(({ row: r, col: c }) => r === row && c === col) ==
      undefined,
  );
  const { row, col } =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return {
    id: Math.random(),
    row,
    col,
    value: Math.random() < 0.9 ? 2 : 4,
  };
};

export const getTranslatedCells = (
  cells: Cell[],
  direction: Direction,
): [Cell[], number] => {
  let mergeScore = 0;
  // Clone cells to avoid mutating original
  const newCells = [
    ...cells
      .filter((cell) => cell.value !== 0) // Could contain cell marked for removal
      .map((cell) => ({ ...cell })),
  ];

  // Helper to get and set cell at specific coords
  const cellMap: (Cell | null)[][] = Array.from(
    { length: config.numRows },
    () => Array(config.numCols).fill(null),
  );

  for (const cell of newCells) {
    cellMap[cell.row][cell.col] = cell;
  }

  const vector = {
    up: { dr: -1, dc: 0 },
    down: { dr: 1, dc: 0 },
    left: { dr: 0, dc: -1 },
    right: { dr: 0, dc: 1 },
  }[direction];

  const orderedCoords = [];
  for (let r = 0; r < config.numRows; r++) {
    for (let c = 0; c < config.numCols; c++) {
      orderedCoords.push({ row: r, col: c });
    }
  }

  // Order traversal based on move direction
  orderedCoords.sort((a, b) => {
    if (direction === 'up') return a.row - b.row;
    if (direction === 'down') return b.row - a.row;
    if (direction === 'left') return a.col - b.col;
    if (direction === 'right') return b.col - a.col;
    return 0;
  });

  for (const { row, col } of orderedCoords) {
    const cell = cellMap[row][col];
    if (!cell || cell.value === 0) continue;

    let r = row;
    let c = col;

    while (true) {
      const nr = r + vector.dr;
      const nc = c + vector.dc;

      if (nr < 0 || nr >= config.numRows || nc < 0 || nc >= config.numCols)
        break;

      const nextCell = cellMap[nr][nc];
      if (
        nextCell &&
        (nextCell.value !== cell.value ||
          cells.find((cell) => cell.id === nextCell.id).value < nextCell.value)
      ) {
        // Cannot move if bumping into cell with different value,
        // or same value but the bumped cell has already merged
        break;
      }

      cellMap[r][c] = null;
      r = nr;
      c = nc;
      if (nextCell) {
        nextCell.value *= 2;
        cell.value = 0;
        mergeScore += nextCell.value;
      } else {
        cellMap[r][c] = cell;
      }
      cell.row = r;
      cell.col = c;
    }
  }

  return [newCells, mergeScore];
};

export const toCellKeys = (cells: { row: number; col: number }[]): string[] =>
  cells.map(({ row, col }) => `${row}-${col}`);

export const toCellCoords = (cells: string[]): { row: number; col: number }[] =>
  cells.map((cell) => {
    const [row, col] = cell.split('-').map(Number) as [number, number];
    return { row, col };
  });
