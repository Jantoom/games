import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Lightbulb, Undo, Trophy, Palette, RotateCcw } from "lucide-react";
import { ButtonProps } from 'react-day-picker';
import { getAutoNotes, getConflictCells, getHintCells, getMismatchCells, toCellKeys } from '@/lib/sudoku';
import { HintsModal } from './modals/HintsModal';
import { RestartModal } from './modals/RestartModal';
import { ThemeModal } from './modals/ThemeModal';
import { LeaderboardModal } from './modals/LeaderboardModal';
import { Difficulty, Grid, LeaderboardEntry, Notes } from '@/lib/types';
import { Themes } from '@/lib/styles';

interface ControlButtonsProps {
  isActive: boolean;
  solvedGrid: Grid;
  originalGrid: Grid;
  grid: Grid;
  notes: Notes;
  setNotes: React.Dispatch<React.SetStateAction<Notes>>;
  setErrors: React.Dispatch<React.SetStateAction<string[]>>;
  restart: (originalGrid: Grid) => void;
  update: (row: number, col: number, num: number, isPencilMode: boolean) => void;
  canUndo: boolean;
  onUndo: () => void;
  isPencilMode: boolean;
  setIsPencilMode: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ControlButtonProps extends ButtonProps {
  isSelected: boolean;
  Icon?: React.ElementType;
}

const ControlButton: React.FC<ControlButtonProps> = ({ isSelected, Icon, ...props}) => (
  <Button
    variant={isSelected ? 'default' : 'ghost'}
    className={`w-[10%] h-auto aspect-square rounded-full hover:bg-secondary transition-colors duration-300 ease-in-out ${isSelected ? 'text-background' : ''}`}
    {...props}
  >
    {Icon !== null ? <Icon className="h-5 w-5" /> : <></>}
  </Button>
);

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  isActive, solvedGrid, originalGrid, grid, notes,
  setNotes, setErrors, restart, update,
  canUndo, onUndo,
  isPencilMode, setIsPencilMode,
}) => {
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const errorBlinkerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedLeaderboardDifficulty, setSelectedLeaderboardDifficulty] = useState<Difficulty>('easy');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(JSON.parse(localStorage.getItem('sudoku-leaderboard')) || []);
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('theme') || 'light-blue';
    for (const [colorAlias, hexCode] of Object.entries(Themes[savedTheme])) {
      document.documentElement.style.setProperty(`--${colorAlias}`, hexCode);
    }
    return savedTheme;
  });

  useEffect(() => {
    if (!isActive) {
      setLeaderboard(JSON.parse(localStorage.getItem('sudoku-leaderboard')));
      setIsLeaderboardOpen(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (theme in Themes) {
      for (const [colorAlias, hexCode] of Object.entries(Themes[theme])) {
        document.documentElement.style.setProperty(`--${colorAlias}`, hexCode);
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const showErrorAnimation = (cells: string[]) => {
    if (errorBlinkerRef.current) {
      setErrors([]);
      clearInterval(errorBlinkerRef.current);
    }
    let count = 0;
    errorBlinkerRef.current = setInterval(() => {
      setErrors(prev => (prev.length ? [] : cells));
      count++;
      if (count >= 6) clearInterval(errorBlinkerRef.current);
    }, 500);
  };

  return (
    <div className="flex justify-evenly w-full">
      <ControlButton isSelected={isRestartOpen} Icon={RotateCcw} onClick={() => setIsRestartOpen(true)}/>
      <ControlButton isSelected={isHintsOpen} Icon={Lightbulb} onClick={() => setIsHintsOpen(true)}/>
      <ControlButton isSelected={isPencilMode} Icon={Pencil} onClick={() => setIsPencilMode(prev => !prev)}/>
      <ControlButton isSelected={false} Icon={Undo} onClick={onUndo} disabled={!canUndo} className="w-[10%] h-auto aspect-square rounded-full active:bg-primary active:text-background transition-colors duration-300 ease-in-out"/>
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
            onAddAutoNotes={() => setNotes({...notes, ...getAutoNotes(grid)})}
            onClose={() => setIsHintsOpen(false)}
          />
          <RestartModal
            isRestartOpen={isRestartOpen}
            onRestart={() => restart(originalGrid)}
            onClose={() => setIsRestartOpen(false)}
          />
          <ThemeModal
            currentTheme={theme}
            isThemeOpen={isThemeOpen}
            onSelectTheme={(t) => setTheme(t)}
            onClose={() => setIsThemeOpen(false)}
          />
          <LeaderboardModal
            entries={leaderboard}
            selectedDifficulty={selectedLeaderboardDifficulty}
            isLeaderboardOpen={isLeaderboardOpen}
            onChangeDifficulty={(direction) => {
              const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
              const currentIndex = difficulties.indexOf(selectedLeaderboardDifficulty);
              const newIndex = direction === 'prev'
              ? (currentIndex - 1 + 3) % 3
              : (currentIndex + 1) % 3;
              setSelectedLeaderboardDifficulty(difficulties[newIndex]);
            }}
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