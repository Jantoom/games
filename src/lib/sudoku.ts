type Grid = number[][];
type Position = { row: number; col: number };

export const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard'): { puzzle: number[][], solution: number[][] } => {
  // First, generate a solved grid
  const solution = Array(9).fill(null).map(() => Array(9).fill(0));
  fillGrid(solution);

  // Then remove numbers based on difficulty
  const numToRemove = {
    easy: 35,
    medium: 45,
    hard: 55,
  }[difficulty];

  const puzzle = solution.map(row => [...row]);
  let count = 0;

  while (count < numToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      count++;
    }
  }

  return { puzzle, solution };
};

const fillGrid = (grid: Grid): boolean => {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) return true;

  const { row, col } = emptyCell;
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of nums) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillGrid(grid)) return true;
      grid[row][col] = 0;
    }
  }

  return false;
};

const findEmptyCell = (grid: Grid): Position | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) return { row, col };
    }
  }
  return null;
};

export const isValidPlacement = (grid: Grid, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
};

const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
