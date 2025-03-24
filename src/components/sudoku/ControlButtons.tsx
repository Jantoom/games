import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Lightbulb, Undo, Trophy, Palette, RotateCcw } from "lucide-react";
import { ButtonProps } from 'react-day-picker';
import { getAutoNotes, getConflictCells, getHintCells, getMismatchCells, toCellKeys } from '@/lib/sudoku';
import { HintsModal } from './modals/HintsModal';
import { RestartModal } from './modals/RestartModal';
import { ThemeModal } from './modals/ThemeModal';
import { LeaderboardModal } from './modals/LeaderboardModal';
import { LeaderboardEntry } from '@/lib/types';
import { Themes } from '@/lib/styles';
import { useSudokuState } from '@/states/sudokuState';

interface ControlButtonsProps {
  restart: () => void;
  update: (row: number, col: number, num: number, isPencilMode: boolean) => void;
  undo: () => void;
}

interface ControlButtonProps extends ButtonProps {
  isSelected: boolean;
  Icon?: React.ElementType;
}

const ControlButton: React.FC<ControlButtonProps> = ({ isSelected, Icon, ...props}) => (
  <Button
    variant={isSelected ? 'default' : 'ghost'}
    className={`w-[10%] h-auto aspect-square rounded-full hover:bg-secondary ${isSelected ? 'text-background' : ''}`}
    {...props}
  >
    {Icon !== null ? <Icon/> : <></>}
  </Button>
);

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  restart, update, undo,
}) => {
  const { seed, isActive, solvedGrid, grid, notes, history, isPencilMode, setState } = useSudokuState();
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light-blue');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(JSON.parse(localStorage.getItem('sudoku-leaderboard')) || []);
  const errorBlinkerRef = useRef<NodeJS.Timeout | null>(null);

  const updateThemeColors = useCallback(() => {
    if (theme in Themes) {
      for (const [colorAlias, hexCode] of Object.entries(Themes[theme])) {
        document.documentElement.style.setProperty(`--${colorAlias}`, hexCode);
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const showErrorAnimation = useCallback((cells: string[]) => {
    if (errorBlinkerRef.current) {
      setState({ errors: [] });
      clearInterval(errorBlinkerRef.current);
    }
    let count = 0;
    errorBlinkerRef.current = setInterval(() => {
      setState(prevState => ({ errors: prevState.errors.length ? [] : cells }));
      count++;
      if (count >= 6) clearInterval(errorBlinkerRef.current);
    }, 500);
  }, [setState]);

  useEffect(() => {
    updateThemeColors();
  }, [updateThemeColors]);

  useEffect(() => {
    updateThemeColors();
  }, [theme, updateThemeColors]);

  useEffect(() => {
    if (!isActive) {
      setLeaderboard(JSON.parse(localStorage.getItem('sudoku-leaderboard')));
      setIsLeaderboardOpen(true);
    }
  }, [isActive]);

  return (
    <div className="flex justify-evenly w-full">
      <ControlButton isSelected={isRestartOpen} Icon={RotateCcw} onClick={() => setIsRestartOpen(true)}/>
      <ControlButton isSelected={isHintsOpen} Icon={Lightbulb} onClick={() => setIsHintsOpen(true)}/>
      <ControlButton isSelected={isPencilMode} Icon={Pencil} onClick={() => setState(prevState => ({ isPencilMode: !prevState.isPencilMode }))}/>
      <ControlButton isSelected={false} Icon={Undo} onClick={undo} disabled={history.length === 0} className="w-[10%] h-auto aspect-square rounded-full active:bg-primary active:text-background"/>
      <ControlButton isSelected={isThemeOpen} Icon={Palette} onClick={() => setIsThemeOpen(true)}/>
      <ControlButton isSelected={isLeaderboardOpen} Icon={Trophy} onClick={() => setIsLeaderboardOpen(true)}/>

      <div className={`fixed inset-0 bg-black/50 flex justify-center transition-opacity duration-300 ease-in-out ${isHintsOpen || isRestartOpen || isThemeOpen || isLeaderboardOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => {
          setIsRestartOpen(false);
          setIsHintsOpen(false);
          setIsThemeOpen(false);
          setIsLeaderboardOpen(false);
        }}>
        <div className='relative flex flex-col w-2/3 items-center justify-center'>
          <HintsModal
            isHintsOpen={isHintsOpen}
            onGiveHint={() => {
              const targetCells = getHintCells(grid, notes, solvedGrid);
              if (targetCells.length > 0) {
                const {row, col} = targetCells[Math.floor(Math.random() * targetCells.length)];
                const correctNumber = solvedGrid[row][col];
                update(row, col, correctNumber, false);
              }
            }}
            onShowMismatches={() => showErrorAnimation(toCellKeys(getConflictCells(grid)))}
            onValidateGrid={() => showErrorAnimation(toCellKeys(getMismatchCells(grid, solvedGrid)))}
            onAddAutoNotes={() => setState(prevState => ({ notes: {...prevState.notes, ...getAutoNotes(prevState.grid)}}))}
            onClose={() => setIsHintsOpen(false)}
          />
          <RestartModal
            isRestartOpen={isRestartOpen}
            onRestart={() => restart()}
            onClose={() => setIsRestartOpen(false)}
          />
          <ThemeModal
            currentTheme={theme}
            isThemeOpen={isThemeOpen}
            onSelectTheme={(t) => setTheme(t)}
            onClose={() => setIsThemeOpen(false)}
          />
          <LeaderboardModal
            seed={seed}
            entries={leaderboard}
            isLeaderboardOpen={isLeaderboardOpen}
            onDeleteEntry={(index) => setLeaderboard((prev) => {
              const newLeaderboard = prev.filter((_, i) => i !== index);
              localStorage.setItem('sudoku-leaderboard', JSON.stringify(newLeaderboard));
              return newLeaderboard;
            })}
            onClose={() => setIsLeaderboardOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};