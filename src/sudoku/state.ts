import seedrandom from 'seedrandom';
import { create, ExtractState } from 'zustand';
import { combine } from 'zustand/middleware';
import { formatTime, getGamesData, saveGameData } from '@/lib/utils';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
  Notes,
} from '@/sudoku/types';
import { generateSudoku, getRelatedCells, toCellKeys } from '@/sudoku/utils';

type SudokuState = ExtractState<typeof useSudokuState>;

export const useSudokuState = create(
  combine(
    {
      seed: '',
      isActive: false,
      time: 0,
      difficulty: 'easy' as Difficulty,
      originalGrid: [] as Grid,
      solvedGrid: [] as Grid,
      grid: [] as Grid,
      notes: {} as Notes,
      history: [] as HistoryEntry[],
      errors: [] as string[],
      selectedNumber: -1,
      isPencilMode: false,
      optHighlightSame: false,
      optRemainingCounts: false,
      optAutoRemove: false,
      usedHighlightSame: false,
      usedRemainingCounts: false,
      usedAutoRemove: false,
      leaderboard: [] as LeaderboardEntry[],
    },
    (set) => ({
      setState: (
        state:
          | Partial<SudokuState>
          | ((state: SudokuState) => Partial<SudokuState>),
      ) => set(state),
      reset: (difficulty: Difficulty) => {
        const newSeed = `${Math.random()}`;
        seedrandom(newSeed, { global: true });
        const { puzzle, solution } = generateSudoku(difficulty);

        set({
          seed: newSeed,
          isActive: true,
          time: 0,
          difficulty: difficulty,
          originalGrid: puzzle.map((row) => [...row]),
          solvedGrid: solution.map((row) => [...row]),
          grid: puzzle.map((row) => [...row]),
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
          selectedNumber: -1,
          isPencilMode: false,
          usedHighlightSame: false,
          usedRemainingCounts: false,
          usedAutoRemove: false,
        });
      },
      restart: () => {
        set((prevState) => ({
          grid: prevState.originalGrid.map((row) => [...row]),
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
          selectedNumber: -1,
          isPencilMode: false,
        }));
      },
      update: (
        row: number,
        col: number,
        number_: number,
        isPencilMode: boolean,
      ) => {
        set((prevState) => {
          const newGrid = prevState.grid.map((r) => [...r]);
          newGrid[row][col] =
            isPencilMode || prevState.grid[row][col] === number_ ? 0 : number_;

          const newNotes = { ...prevState.notes };
          for (const key of isPencilMode
            ? [`${row}-${col}`]
            : prevState.optAutoRemove
              ? toCellKeys(getRelatedCells(row, col))
              : []) {
            newNotes[key] = new Set(prevState.notes[key]);
            if (newNotes[key].has(number_)) {
              newNotes[key].delete(number_);
            } else if (isPencilMode) {
              newNotes[key].add(number_);
            }
          }
          if (!isPencilMode) newNotes[`${row}-${col}`] = new Set();

          const newHistory = [
            ...prevState.history,
            {
              grid: prevState.grid.map((row) => [...row]),
              notes: Object.fromEntries(
                Object.entries(prevState.notes).map(([key, value]) => [
                  key,
                  new Set(value),
                ]),
              ),
            },
          ];

          return { grid: newGrid, notes: newNotes, history: newHistory };
        });
      },
      undo: () => {
        set((prevState) => {
          const lastStep = prevState.history.at(-1);
          if (lastStep === undefined) return {};
          return {
            grid: lastStep.grid.map((row) => [...row]),
            notes: Object.fromEntries(
              Object.entries(lastStep.notes).map(([key, value]) => [
                key,
                new Set(value),
              ]),
            ),
            history: prevState.history.slice(0, -1),
          };
        });
      },
      stop: () => {
        set((prevState) => {
          const gamesData = getGamesData();
          const prevLeaderboard = (gamesData['sudoku']?.leaderboard ??
            []) as LeaderboardEntry[];
          const newEntry: LeaderboardEntry = {
            seed: prevState.seed,
            difficulty: prevState.difficulty,
            score: formatTime(prevState.time),
            hints: [
              prevState.usedHighlightSame || prevState.optHighlightSame,
              prevState.usedRemainingCounts || prevState.optRemainingCounts,
              prevState.usedAutoRemove || prevState.optAutoRemove,
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
            isActive: false,
            isPencilMode: false,
            selectedNumber: undefined,
          };
        });
      },
    }),
  ),
);
