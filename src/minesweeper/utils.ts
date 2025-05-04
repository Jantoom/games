import { Difficulty, Grid } from '@/minesweeper/types';

const difficultyConfig: Record<
  Difficulty,
  { numRows: number; numCols: number; numBombs: number }
> = {
  beginner: { numRows: 10, numCols: 10, numBombs: 12 },
  easy: { numRows: 12, numCols: 10, numBombs: 20 },
  medium: { numRows: 16, numCols: 16, numBombs: 40 },
  hard: { numRows: 22, numCols: 16, numBombs: 70 },
  extreme: { numRows: 30, numCols: 16, numBombs: 99 },
};

let config: { numRows: number; numCols: number; numBombs: number } =
  difficultyConfig.easy;
let cellCoords: { row: number; col: number }[] = Array.from({
  length: 9,
}).flatMap((_, row) =>
  Array.from({ length: 9 }).map((_, col) => ({ row, col })),
);

export const generateMinesweeper = (
  difficulty: Difficulty,
): {
  dimensions: [number, number];
  numBombs: number;
  puzzle: Grid;
  bombs: Set<string>;
} => {
  config = difficultyConfig[difficulty];
  cellCoords = Array.from({ length: config.numRows }).flatMap((_, row) =>
    Array.from({ length: config.numCols }).map((_, col) => ({ row, col })),
  );

  const puzzle = Array.from({ length: config.numRows }).map(() =>
    Array.from({ length: config.numCols }),
  ) as Grid;
  const bombs = new Set<string>();
  while (bombs.size < config.numBombs) {
    bombs.add(
      `${Math.floor(Math.random() * config.numRows)}-${Math.floor(Math.random() * config.numCols)}`,
    );
  }

  return {
    dimensions: [config.numRows, config.numCols],
    numBombs: config.numBombs,
    puzzle,
    bombs,
  };
};

export const isSolved = (
  grid: Grid,
  bombs: Set<string>,
  flags: Set<string>,
): boolean =>
  bombs.size === flags.size &&
  ([...bombs] as string[]).every((bomb) => flags.has(bomb)) &&
  grid
    .flatMap((array, row) =>
      array.map((num, col) => (num != null ? true : `${row}-${col}`)),
    )
    .every((key) => key === true || flags.has(key));

export const getAdjacentCells = (
  row: number,
  col: number,
): { row: number; col: number }[] =>
  (
    [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ] as [number, number][]
  )
    .map(([dy, dx]) => ({ row: row + dy, col: col + dx }))
    .filter(
      ({ row: y, col: x }) =>
        y > -1 &&
        y < config.numRows &&
        x > -1 &&
        x < config.numCols &&
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
    const { row, col } = queue.shift() as { row: number; col: number };
    const key = `${row}-${col}`;

    if (visited.has(key)) continue;

    visited.add(key);

    const adjacentCells = getAdjacentCells(row, col);
    const adjacentSafeCells = getAdjacentSafeCells(bombs, adjacentCells);
    const adjacentBombs = adjacentCells.length - adjacentSafeCells.length;

    result.push({ row, col, adjacentBombs });

    // Expand if no adjacent bombs
    if (!adjacentBombs) {
      for (const { row, col } of adjacentSafeCells) {
        queue.push({ row, col });
      }
    }
  }

  return result;
};

export const getHintCells = (
  grid: Grid,
  bombs: Set<string>,
): { row: number; col: number }[] =>
  cellCoords.filter(
    ({ row, col }) =>
      grid[row][col] === undefined && !bombs.has(`${row}-${col}`),
  );

export const toCellKeys = (cells: { row: number; col: number }[]): string[] =>
  cells.map(({ row, col }) => `${row}-${col}`);

export const toCellCoords = (cells: string[]): { row: number; col: number }[] =>
  cells.map((cell) => {
    const [row, col] = cell.split('-').map(Number) as [number, number];
    return { row, col };
  });

export const positionCellsAreEqual = (
  pos1: { x: number; y: number },
  pos2: { x: number; y: number },
): boolean => {
  const cell1 = getCellFromPosition(pos1);
  const cell2 = getCellFromPosition(pos2);
  return (
    cell1 !== undefined &&
    cell2 !== undefined &&
    cell1.row === cell2.row &&
    cell1.col === cell2.col
  );
};

export const getCellFromPosition = (position: {
  x: number;
  y: number;
}): { row: number; col: number } | undefined => {
  if (!position) return undefined;
  const key: string | undefined =
    document
      .elementFromPoint(position.x, position.y)
      ?.closest('[data-id]')
      ?.getAttribute('data-id') ?? undefined;
  if (!key) return undefined;
  const [row, col] = key.split('-').map((value) => +value) as [number, number];
  return { row, col };
};
