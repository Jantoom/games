import { Button } from "@/components/ui/button";
import { Difficulty, LeaderboardEntry } from "../types";

interface LeaderboardModalProps {
  onClose: () => void;
  entries: LeaderboardEntry[];
  selectedDifficulty: Difficulty;
  onChangeDifficulty: (direction: 'prev' | 'next') => void;
  onDeleteEntry: (index: number) => void;
  formatTime: (seconds: number) => string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  entries,
  selectedDifficulty,
  onChangeDifficulty,
  onDeleteEntry,
  formatTime,
}) => (
  <>
    <h3 className="text-lg font-semibold text-center mb-4 text-foreground">Leaderboard</h3>
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        onClick={() => onChangeDifficulty('prev')}
        className="w-10 h-10 p-0 text-foreground hover:bg-secondary rounded-full"
      >
        <svg className="h-5 w-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </Button>
      <span className="text-foreground capitalize">{selectedDifficulty}</span>
      <Button
        variant="ghost"
        onClick={() => onChangeDifficulty('next')}
        className="w-10 h-10 p-0 text-foreground hover:bg-secondary rounded-full"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </Button>
    </div>
    <div className="h-60 overflow-y-auto scrollbar-none touch-pan-y space-y-2 mb-4">
      {entries
        .filter(entry => entry.difficulty === selectedDifficulty)
        .map((entry, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-background border border-border rounded">
            <span className="text-foreground">{formatTime(entry.time)}</span>
            <span className="text-foreground">{new Date(entry.date).toLocaleDateString()}</span>
            <Button
              variant="ghost"
              onClick={() => onDeleteEntry(index)}
              className="w-8 h-8 p-0 text-foreground hover:bg-secondary rounded-full"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </Button>
          </div>
        ))}
    </div>
    <Button onClick={onClose} variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
      Close
    </Button>
  </>
);
