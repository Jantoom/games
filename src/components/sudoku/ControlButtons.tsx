import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Lightbulb, Undo, Trophy, Palette } from "lucide-react";

interface ControlButtonsProps {
  onRestart: () => void;
  onHints: () => void;
  onPencil: () => void;
  onUndo: () => void;
  onTheme: () => void;
  onLeaderboard: () => void;
  isPencilMode: boolean;
  isHintsOpen: boolean;
  isRestartOpen: boolean;
  canUndo: boolean;
  isThemeOpen: boolean;
  isLeaderboardOpen: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onRestart,
  onHints,
  onPencil,
  onUndo,
  onTheme,
  onLeaderboard,
  isPencilMode,
  isHintsOpen,
  isRestartOpen,
  canUndo,
  isThemeOpen,
  isLeaderboardOpen,
}) => (
  <>
    <Button
      variant={isRestartOpen ? 'default' : 'ghost'}
      onClick={onRestart}
      className={`w-10 h-10 rounded-full hover:bg-secondary ${isRestartOpen ? 'text-background' : ''}`}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 12a9 9 0 1 1 9 9M3 12h9" />
      </svg>
    </Button>
    <Button
      variant={isHintsOpen ? 'default' : 'ghost'}
      onClick={onHints}
      className={`w-10 h-10 rounded-full hover:bg-secondary ${isHintsOpen ? 'text-background' : ''}`}
    >
      <Lightbulb className="h-5 w-5" />
    </Button>
    <Button
      variant={isPencilMode ? 'default' : 'ghost'}
      onClick={onPencil}
      className={`w-10 h-10 rounded-full hover:bg-secondary ${isPencilMode ? 'text-background' : ''}`}
    >
      <Pencil className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      onClick={onUndo}
      disabled={!canUndo}
      className="w-10 h-10 rounded-full hover:bg-secondary active:bg-primary active:text-background transition-colors duration-200"
    >
      <Undo className="h-5 w-5" />
    </Button>
    <Button
      variant={isThemeOpen ? 'default' : 'ghost'}
      onClick={onTheme}
      className={`w-10 h-10 rounded-full hover:bg-secondary ${isThemeOpen ? 'text-background' : ''}`}
    >
      <Palette className="h-5 w-5" />
    </Button>
    <Button
      variant={isLeaderboardOpen ? 'default' : 'ghost'}
      onClick={onLeaderboard}
      className={`w-10 h-10 rounded-full hover:bg-secondary ${isLeaderboardOpen ? 'text-background' : ''}`}
    >
      <Trophy className="h-5 w-5" />
    </Button>
  </>
);
