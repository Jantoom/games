import seedrandom from 'seedrandom';
import { create } from 'zustand';
import { GameStatus, SerializableSet } from '@/lib/types';
import { formatTime, getGamesData, saveGameData } from '@/lib/utils';
import {
  Difficulty,
  Grid,
  HistoryEntry,
  LeaderboardEntry,
} from '@/minesweeper/types';
import {
  generateMinesweeper,
  getAdjacentCells,
  getAdjacentSafeCells,
  getSafeCells,
  toCellCoords,
} from '@/minesweeper/utils';

export type MinesweeperState = {
  status: GameStatus;
  seed: string;
  time: number;
  difficulty: Difficulty;
  dimensions: [number, number];
  numBombs: number;
  grid: Grid;
  bombs: SerializableSet<string>;
  flags: SerializableSet<string>;
  history: HistoryEntry[];
  flagMode: boolean;
  optFlagOnClick: boolean;
  optFlagOnDoubleClick: boolean;
  optFlagOnLongClick: boolean;
  optFlagOnRightClick: boolean;
  optShowRemainingBombs: boolean;
  optShowTime: boolean;
  usedHints: number;
  leaderboard: LeaderboardEntry[];
  setState: (
    newState:
      | Partial<MinesweeperState>
      | ((state: MinesweeperState) => Partial<MinesweeperState>),
  ) => void;
  wipe: () => void;
  read: () => MinesweeperState | undefined;
  save: () => void;
  tick: () => number;
  reset: (difficulty?: Difficulty, state?: MinesweeperState) => void;
  update: (row: number, col: number, flagMode: boolean) => void;
  stop: (win: boolean) => void;
};

const baseMinesweeperState: Partial<MinesweeperState> = {
  status: 'setup',
  seed: '',
  time: 0,
  difficulty: 'easy',
  dimensions: [0, 0],
  numBombs: 0,
  grid: [],
  bombs: new SerializableSet(),
  flags: new SerializableSet(),
  history: [],
  flagMode: false,
  optFlagOnClick: false,
  optFlagOnDoubleClick: true,
  optFlagOnLongClick: true,
  optFlagOnRightClick: true,
  optShowRemainingBombs: true,
  optShowTime: true,
  usedHints: 0,
  leaderboard: [],
};

export const useMinesweeperState = create<MinesweeperState>((set) => ({
  status: 'setup',
  seed: '',
  time: 0,
  difficulty: 'easy',
  dimensions: [0, 0],
  numBombs: 0,
  grid: [],
  bombs: new SerializableSet(),
  flags: new SerializableSet(),
  history: [],
  flagMode: false,
  optFlagOnClick: false,
  optFlagOnDoubleClick: true,
  optFlagOnLongClick: true,
  optFlagOnRightClick: true,
  optShowRemainingBombs: true,
  optShowTime: true,
  usedHints: 0,
  leaderboard: [],
  setState: (newState) => set(newState),
  wipe: () => {
    set(baseMinesweeperState);
  },
  read: () => {
    return (getGamesData()['minesweeper'] as MinesweeperState) ?? undefined;
  },
  save: () => {
    set((prev) => {
      const gamesData = getGamesData();
      const { setState, read, save, tick, reset, update, stop, ...saveData } =
        prev;

      saveGameData(gamesData, {
        minesweeper: saveData,
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
      const { dimensions, numBombs, puzzle, bombs } = generateMinesweeper(
        difficulty ?? state?.difficulty ?? prev.difficulty,
      );

      const resetState = {
        status: 'play',
        seed: newSeed,
        time: 0,
        difficulty: difficulty ?? state?.difficulty ?? prev.difficulty,
        dimensions: dimensions,
        numBombs: numBombs,
        grid: puzzle,
        bombs: bombs,
        flags: new SerializableSet(),
        history: [],
        usedHints: 0,
      } as Partial<MinesweeperState>;

      return state
        ? {
            ...resetState,
            ...state,
          }
        : resetState;
    });
  },
  update: (row, col, flagMode) => {
    set((prev) => {
      if (prev.status !== 'play') return {};

      const newHistory = [
        ...prev.history,
        {
          grid: prev.grid.map((row) => [...row]),
          flags: new SerializableSet(prev.flags),
        },
      ];

      const newFlags = new SerializableSet(prev.flags);
      if (flagMode) {
        if (prev.grid[row][col] != undefined) return {};

        if (newFlags.has(`${row}-${col}`)) {
          newFlags.delete(`${row}-${col}`);
        } else {
          newFlags.add(`${row}-${col}`);
        }
        return { flags: newFlags, history: newHistory };
      }

      const newGrid = prev.grid.map((r) => [...r]);
      const safeCells = getSafeCells(prev.bombs, row, col);
      if (safeCells.length > 0) {
        for (const { row, col, adjacentBombs } of safeCells) {
          newGrid[row][col] = adjacentBombs;
          newFlags.delete(`${row}-${col}`);
        }
        return { grid: newGrid, flags: newFlags, history: newHistory };
      }

      prev.stop(false);
      return {};
    });
  },
  stop: (win) => {
    set((prev) => {
      let newGrid: Grid;
      const newLeaderboard: LeaderboardEntry[] = [...prev.leaderboard];
      if (win) {
        // Add the current game to the leaderboard
        newLeaderboard.push({
          seed: prev.seed,
          difficulty: prev.difficulty,
          score: formatTime(prev.time),
          hints: prev.usedHints,
          date: new Date().toISOString(),
        });
        newLeaderboard.sort((a, b) => a.score.localeCompare(b.score));

        // Reveal remaining cells
        newGrid = prev.grid.map((array, row) =>
          array.map((num, col) => {
            if (num != undefined || prev.flags.has(`${row}-${col}`)) return num;
            const adjacentCells = getAdjacentCells(row, col);
            return (
              adjacentCells.length -
              getAdjacentSafeCells(prev.bombs, adjacentCells).length
            );
          }),
        );
      } else {
        // Reveal all bombs
        newGrid = prev.grid.map((r) => [...r]);
        for (const { row, col } of toCellCoords([...prev.bombs] as string[])) {
          newGrid[row][col] = -1;
        }
      }

      const newState: MinesweeperState = {
        ...prev,
        status: 'finished',
        flagMode: false,
        grid: newGrid,
        leaderboard: newLeaderboard,
      };

      // Sort the leaderboard by score and save to local storage
      saveGameData(getGamesData(), {
        minesweeper: newState,
      });

      return newState;
    });
  },
}));
