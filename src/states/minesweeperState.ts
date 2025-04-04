import seedrandom from 'seedrandom';
import { create, ExtractState } from 'zustand';
import { combine } from 'zustand/middleware';
import {
  generateMinesweeper,
  getAdjacentCells,
  getAdjacentSafeCells,
  getSafeCells,
  toCellCoords,
} from '@/lib/minesweeper';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
} from '@/lib/minesweeperTypes';

type MinesweeperState = ExtractState<typeof useMinesweeperState>;

export const useMinesweeperState = create(
  combine(
    {
      seed: 0,
      isActive: false,
      time: 0,
      difficulty: 'easy' as Difficulty,
      dimensions: [0, 0] as [number, number],
      numBombs: 0,
      grid: [] as Grid,
      bombs: new Set<string>(),
      flags: new Set<string>(),
      history: [] as HistoryEntry[],
      isFlagMode: false,
      flagOnClick: false,
      flagOnDoubleClick: true,
      flagOnLongClick: true,
      flagOnRightClick: true,
      leaderboard: [] as LeaderboardEntry[],
    },
    (set) => ({
      setState: (
        newState:
          | Partial<MinesweeperState>
          | ((state: MinesweeperState) => Partial<MinesweeperState>),
      ) => set(newState),
      reset: (difficulty: Difficulty) => {
        const newSeed = Math.random();
        seedrandom(`${newSeed}`, { global: true });
        const { dimensions, numBombs, puzzle, bombs } =
          generateMinesweeper(difficulty);

        set({
          seed: newSeed,
          isActive: true,
          time: 0,
          difficulty: difficulty,
          dimensions: dimensions,
          numBombs: numBombs,
          grid: puzzle.map((row) => [...row]),
          bombs: new Set(bombs),
          flags: new Set(),
          history: [],
        });
      },
      update: (row: number, col: number, isFlagMode: boolean) => {
        set((prevState) => {
          if (!prevState.isActive) return {};

          const newHistory = [
            ...prevState.history,
            {
              grid: prevState.grid.map((row) => [...row]),
              flags: new Set(prevState.flags),
            },
          ];

          const newFlags = new Set(prevState.flags);
          if (isFlagMode && prevState.grid[row]![col] === undefined) {
            if (newFlags.has(`${row}-${col}`)) {
              newFlags.delete(`${row}-${col}`);
            } else {
              newFlags.add(`${row}-${col}`);
            }
            return { flags: newFlags, history: newHistory };
          }

          const newGrid = prevState.grid.map((r) => [...r]);
          const safeCells = getSafeCells(prevState.bombs, row, col);
          if (safeCells.length === 0) {
            (prevState as MinesweeperState).stop(false);
            return {};
          }
          for (const { row, col, adjacentBombs } of safeCells) {
            newGrid[row]![col] = adjacentBombs;
            newFlags.delete(`${row}-${col}`);
          }

          return { grid: newGrid, flags: newFlags, history: newHistory };
        });
      },
      stop: (win: boolean) => {
        set((prevState) => {
          const prevLeaderboard = JSON.parse(
            localStorage.getItem('minesweeper-leaderboard') ?? '[]',
          ) as LeaderboardEntry[];
          const newEntry: LeaderboardEntry = {
            seed: prevState.seed,
            time: prevState.time,
            difficulty: prevState.difficulty,
            date: new Date().toISOString(),
          };
          const newLeaderboard = [...prevLeaderboard, newEntry];
          newLeaderboard.sort((a, b) => a.time - b.time);
          localStorage.setItem(
            'minesweeper-leaderboard',
            JSON.stringify(newLeaderboard),
          );

          if (win) {
            const newGrid = prevState.grid.map((array, row) =>
              array.map((number_, col) => {
                if (
                  number_ != undefined ||
                  prevState.flags.has(`${row}-${col}`)
                )
                  return number_;
                const adjacentCells = getAdjacentCells(row, col);
                return (
                  adjacentCells.length -
                  getAdjacentSafeCells(prevState.bombs, adjacentCells).length
                );
              }),
            );

            return { isActive: false, grid: newGrid };
          } else {
            const newGrid = prevState.grid.map((r) => [...r]);
            for (const { row, col } of toCellCoords([...prevState.bombs])) {
              newGrid[row]![col] = -1;
            }
            return { isActive: false, grid: newGrid };
          }
        });
      },
    }),
  ),
);
