import seedrandom from 'seedrandom';
import { create } from 'zustand';
import { formatTime, getGamesData, saveGameData } from '@/lib/utils';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
  Notes,
} from '@/sudoku/types';
import { generateSudoku, getRelatedCells, toCellKeys } from '@/sudoku/utils';
import { GameStatus } from '@/lib/types';

export type SudokuState = {
  status: GameStatus;
  seed: string;
  time: number;
  difficulty: Difficulty;
  originalGrid: Grid;
  solvedGrid: Grid;
  grid: Grid;
  notes: Notes;
  history: HistoryEntry[];
  errors: string[];
  selectedNumber: number;
  pencilMode: boolean;
  optAssistHighlight: boolean;
  optAssistRemaining: boolean;
  optAssistAutoRemove: boolean;
  optShowTime: boolean;
  usedAssistHighlight: boolean;
  usedAssistRemaining: boolean;
  usedAssistAutoRemove: boolean;
  leaderboard: LeaderboardEntry[];
  setState: (
    newState:
      | Partial<SudokuState>
      | ((state: SudokuState) => Partial<SudokuState>),
  ) => void;
  tick: () => number;
  reset: (difficulty?: Difficulty) => void;
  restart: () => void;
  update: (row: number, col: number, num: number, pencilMode: boolean) => void;
  undo: () => void;
  stop: (win: boolean) => void;
};

export const useSudokuState = create<SudokuState>((set) => ({
  status: undefined,
  seed: '',
  time: 0,
  difficulty: 'easy' as Difficulty,
  originalGrid: [] as Grid,
  solvedGrid: [] as Grid,
  grid: [] as Grid,
  notes: {} as Notes,
  history: [] as HistoryEntry[],
  errors: [] as string[],
  selectedNumber: undefined,
  pencilMode: false,
  optAssistHighlight: false,
  optAssistRemaining: false,
  optAssistAutoRemove: false,
  optShowTime: true,
  usedAssistHighlight: false,
  usedAssistRemaining: false,
  usedAssistAutoRemove: false,
  leaderboard: [] as LeaderboardEntry[],
  setState: (state) => set(state),
  tick: () => {
    let time: number = undefined;
    set((prev) => {
      time = prev.time + 1;
      return { time };
    });
    return time;
  },
  reset: (difficulty = 'easy') => {
    const newSeed = `${Math.random()}`;
    seedrandom(newSeed, { global: true });
    const { puzzle, solution } = generateSudoku(difficulty);

    set({
      status: 'play',
      seed: newSeed,
      time: 0,
      difficulty: difficulty,
      originalGrid: puzzle.map((row) => [...row]),
      solvedGrid: solution,
      grid: puzzle,
      notes: Object.fromEntries(
        Array.from({ length: 9 }).flatMap((_, row) =>
          Array.from({ length: 9 }).map((_, col) => [
            `${row}-${col}`,
            new Set<number>(),
          ]),
        ),
      ),
      history: [],
      errors: [],
      selectedNumber: undefined,
      pencilMode: false,
      usedAssistHighlight: false,
      usedAssistRemaining: false,
      usedAssistAutoRemove: false,
    });
  },
  restart: () => {
    set((prev) => ({
      grid: prev.originalGrid.map((row) => [...row]),
      notes: Object.fromEntries(
        Array.from({ length: 9 }).flatMap((_, row) =>
          Array.from({ length: 9 }).map((_, col) => [
            `${row}-${col}`,
            new Set<number>(),
          ]),
        ),
      ),
      history: [],
      errors: [],
      selectedNumber: undefined,
      pencilMode: false,
    }));
  },
  update: (row, col, num, pencilMode) => {
    set((prev) => {
      if (prev.status !== 'play') return {};

      const newHistory = [
        ...prev.history,
        {
          grid: prev.grid.map((row) => [...row]),
          notes: Object.fromEntries(
            Object.entries(prev.notes).map(([key, value]) => [
              key,
              new Set(value),
            ]),
          ),
        },
      ];

      const newNotes = { ...prev.notes };
      if (num === 0) {
        newNotes[`${row}-${col}`] = new Set();
      } else {
        const affectedCells = pencilMode
          ? [`${row}-${col}`]
          : prev.optAssistAutoRemove
            ? toCellKeys(getRelatedCells(row, col))
            : [];
        for (const key of affectedCells) {
          newNotes[key] = new Set(prev.notes[key]);
          if (newNotes[key].has(num)) {
            newNotes[key].delete(num);
          } else if (pencilMode) {
            newNotes[key].add(num);
          }
        }
      }

      const newGrid = prev.grid.map((r) => [...r]);
      newGrid[row][col] = prev.grid[row][col] !== num && !pencilMode ? num : 0;

      return { grid: newGrid, notes: newNotes, history: newHistory };
    });
  },
  undo: () => {
    set((prev) => {
      if (prev.status !== 'play') return {};

      const lastStep = prev.history.at(-1);
      return lastStep === undefined
        ? {}
        : {
            grid: lastStep.grid.map((row) => [...row]),
            notes: Object.fromEntries(
              Object.entries(lastStep.notes).map(([key, value]) => [
                key,
                new Set(value),
              ]),
            ),
            history: prev.history.slice(0, -1),
          };
    });
  },
  stop: () => {
    set((prev) => {
      const gamesData = getGamesData();
      const prevLeaderboard = (gamesData['sudoku']?.leaderboard ??
        []) as LeaderboardEntry[];
      const newEntry: LeaderboardEntry = {
        seed: prev.seed,
        difficulty: prev.difficulty,
        score: formatTime(prev.time),
        hints: [
          prev.usedAssistHighlight || prev.optAssistHighlight,
          prev.usedAssistRemaining || prev.optAssistRemaining,
          prev.usedAssistAutoRemove || prev.optAssistAutoRemove,
        ],
        date: new Date().toISOString(),
      };
      const newLeaderboard = [...prevLeaderboard, newEntry];
      newLeaderboard.sort((a, b) => a.score.localeCompare(b.score));
      saveGameData(gamesData, {
        sudoku: {
          ...gamesData['sudoku'],
          leaderboard: newLeaderboard,
        },
      });

      return {
        status: 'finished',
        pencilMode: false,
        selectedNumber: undefined,
      };
    });
  },
}));
