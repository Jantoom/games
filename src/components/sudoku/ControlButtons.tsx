
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
  canUndo: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onRestart,
  onHints,
  onPencil,
  onUndo,
  onTheme,
  onLeaderboard,
  isPencilMode,
  canUndo,
}) => {
  return (
    <div className="flex justify-center gap-4 w-full">
      <Button
        variant="ghost"
        onClick={onRestart}
        className="w-[45px] h-[45px] p-0 rounded-full"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 12a9 9 0 1 1 9 9M3 12h9" />
        </svg>
      </Button>
      <Button
        variant="ghost"
        onClick={onHints}
        className="w-[45px] h-[45px] p-0 rounded-full"
      >
        <Lightbulb className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        onClick={onPencil}
        className={`w-[45px] h-[45px] p-0 ${isPencilMode ? 'bg-blue-100 rounded-full' : 'rounded-full'}`}
      >
        <Pencil className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        onClick={onUndo}
        disabled={!canUndo}
        className="w-[45px] h-[45px] p-0 rounded-full"
      >
        <Undo className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        onClick={onTheme}
        className="w-[45px] h-[45px] p-0 rounded-full"
      >
        <Palette className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        onClick={onLeaderboard}
        className="w-[45px] h-[45px] p-0 rounded-full"
      >
        <Trophy className="h-5 w-5" />
      </Button>
    </div>
  );
};
