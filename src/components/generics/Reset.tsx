import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useGlobalStore } from '@/lib/state';
import { cn, swapLastUrlSubpath } from '@/lib/utils';
import DifficultyCarousel from './DifficultyCarousel';

interface ResetBodyProps<T extends string, U extends { status: string }> {
  status: string;
  reset: (difficulty?: T, state?: U) => void;
  difficulty: T;
  difficulties: T[];
  className?: string;
}
const ResetBody = <T extends string, U extends { status: string }>({
  status,
  reset,
  difficulty,
  difficulties,
  className,
}: ResetBodyProps<T, U>) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<T>(difficulty);
  const [justCreated, setJustCreated] = useState(false);
  const { setState } = useGlobalStore();

  const disableResume =
    justCreated || status === 'create' || selectedDifficulty != difficulty;

  return (
    <div className={cn('flex w-full flex-col items-center gap-y-4', className)}>
      <DifficultyCarousel
        difficulty={difficulty}
        difficulties={difficulties}
        setDifficulty={setSelectedDifficulty}
      />
      <Link
        to={swapLastUrlSubpath(useLocation().pathname, '/play')}
        className="w-full"
      >
        <Button
          onClick={() => {
            setState({ navDirection: 'right' });
            if (selectedDifficulty != difficulty) {
              setJustCreated(true);
            }
            reset(selectedDifficulty);
          }}
          variant="outline"
          className="w-full rounded-full"
        >
          New game
        </Button>
      </Link>
      <Link
        to={swapLastUrlSubpath(useLocation().pathname, '/play')}
        className={`w-full ${disableResume ? 'pointer-events-none opacity-0' : ''}`}
      >
        <Button
          onClick={() => {
            setState({ navDirection: 'right' });
          }}
          variant="outline"
          className="w-full rounded-full"
          disabled={disableResume}
        >
          Resume game
        </Button>
      </Link>
    </div>
  );
};

interface ResetDialogProps {
  restart?: () => void;
  reset: () => void;
  className?: string;
}
const ResetDialog: React.FC<ResetDialogProps> = ({
  restart,
  reset,
  className,
}) => {
  return (
    <div className={cn('flex flex-row gap-2', className)}>
      {restart && (
        <DialogClose asChild>
          <Button
            onClick={() => restart()}
            variant="outline"
            className="w-full rounded-full"
          >
            Clear game
          </Button>
        </DialogClose>
      )}
      <DialogClose asChild>
        <Button
          onClick={() => reset()}
          variant="outline"
          className="w-full rounded-full"
        >
          New game
        </Button>
      </DialogClose>
    </div>
  );
};

interface ResetPromptProps<T extends string> {
  reset: (difficulty: T) => void;
  difficulty: T;
  difficulties: T[];
}
const ResetPrompt = <T extends string>({
  reset,
  difficulty,
  difficulties,
}: ResetPromptProps<T>) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);

  return (
    <div className="mb-6 flex w-[90svw] items-center justify-evenly gap-x-4">
      <Button
        onClick={() => reset(selectedDifficulty)}
        variant="outline"
        className="w-[45%] rounded-full"
      >
        New game
      </Button>
      <DifficultyCarousel
        difficulty={selectedDifficulty}
        difficulties={difficulties}
        setDifficulty={setSelectedDifficulty}
        className="w-[45%]"
      />
    </div>
  );
};

export { ResetBody, ResetDialog, ResetPrompt };
