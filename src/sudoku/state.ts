import seedrandom from 'seedrandom';
import { create } from 'zustand';
import { GameStatus, SerializableSet } from '@/lib/types';
import { formatTime, getGamesData, saveGameData } from '@/lib/utils';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
  Notes,
} from '@/sudoku/types';
import { generateSudoku, getRelatedCells, toCellKeys } from '@/sudoku/utils';

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
  read: () => SudokuState | undefined;
  save: () => void;
  tick: () => number;
  reset: (difficulty?: Difficulty, state?: SudokuState) => void;
  restart: () => void;
  update: (row: number, col: number, num: number, pencilMode: boolean) => void;
  undo: () => void;
  stop: (win: boolean) => void;
};

export const useSudokuState = create<SudokuState>((set) => ({
  status: 'create',
  seed: '',
  time: 0,
  difficulty: 'easy',
  originalGrid: [],
  solvedGrid: [],
  grid: [],
  notes: {},
  history: [],
  errors: [],
  selectedNumber: undefined,
  pencilMode: false,
  optAssistHighlight: false,
  optAssistRemaining: false,
  optAssistAutoRemove: false,
  optShowTime: true,
  usedAssistHighlight: false,
  usedAssistRemaining: false,
  usedAssistAutoRemove: false,
  leaderboard: [],
  setState: (state) => set(state),
  read: () => {
    return (getGamesData()['sudoku'] as SudokuState) ?? undefined;
  },
  save: () => {
    set((prev) => {
      const gamesData = getGamesData();
      const {
        setState: _setState,
        read: _read,
        save: _save,
        tick: _tick,
        reset: _reset,
        restart: _restart,
        update: _update,
        undo: _undo,
        stop: _stop,
        ...saveData
      } = prev;

      saveGameData(gamesData, {
        sudoku: saveData,
      });

      return {};
    });
  },
  tick: () => {
    let time: number;
    set((prev) => {
      time = prev.time + 1;
      return { time };
    });
    return time;
  },
  reset: (difficulty, state) => {
    set((prev) => {
      const newSeed = `${Math.random()}`;
      seedrandom(newSeed, { global: true });
      const { puzzle, solution } = generateSudoku(
        difficulty ?? state?.difficulty ?? prev.difficulty,
      );

      const resetState = {
        ...prev,
        status: 'play',
        seed: newSeed,
        time: 0,
        difficulty: difficulty ?? state?.difficulty ?? prev.difficulty,
        originalGrid: puzzle.map((row) => [...row]),
        solvedGrid: solution,
        grid: puzzle,
        notes: Object.fromEntries(
          Array.from({ length: 9 }).flatMap((_, row) =>
            Array.from({ length: 9 }).map((_, col) => [
              `${row}-${col}`,
              new SerializableSet<number>(),
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
      } as SudokuState;

      return state
        ? {
            ...resetState,
            ...state,
          }
        : resetState;
    });
  },
  restart: () => {
    set((prev) => ({
      grid: prev.originalGrid.map((row) => [...row]),
      notes: Object.fromEntries(
        Array.from({ length: 9 }).flatMap((_, row) =>
          Array.from({ length: 9 }).map((_, col) => [
            `${row}-${col}`,
            new SerializableSet<number>(),
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
              new SerializableSet(value),
            ]),
          ),
        },
      ];

      const newNotes = { ...prev.notes };
      if (num !== 0) {
        const affectedCells = pencilMode
          ? [`${row}-${col}`]
          : prev.optAssistAutoRemove
            ? toCellKeys(getRelatedCells(row, col))
            : [];
        for (const key of affectedCells) {
          newNotes[key] = new SerializableSet(prev.notes[key]);
          if (newNotes[key].has(num)) {
            newNotes[key].delete(num);
          } else if (pencilMode) {
            newNotes[key].add(num);
          }
        }
      }
      if (!pencilMode || num === 0) {
        newNotes[`${row}-${col}`] = new SerializableSet();
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
                new SerializableSet(value),
              ]),
            ),
            history: prev.history.slice(0, -1),
          };
    });
  },
  stop: (win) => {
    set((prev) => {
      const newLeaderboard: LeaderboardEntry[] = [...prev.leaderboard];
      if (win) {
        // Add the current game to the leaderboard
        newLeaderboard.push({
          seed: prev.seed,
          difficulty: prev.difficulty,
          score: formatTime(prev.time),
          hints: [
            prev.usedAssistHighlight || prev.optAssistHighlight,
            prev.usedAssistRemaining || prev.optAssistRemaining,
            prev.usedAssistAutoRemove || prev.optAssistAutoRemove,
          ],
          date: new Date().toISOString(),
        });
        newLeaderboard.sort((a, b) => a.score.localeCompare(b.score));
      }

      const newState: SudokuState = {
        ...prev,
        status: 'finished',
        pencilMode: false,
        selectedNumber: undefined,
        leaderboard: newLeaderboard,
      };

      saveGameData(getGamesData(), {
        sudoku: newState,
      });

      return newState;
    });
  },
}));
