import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useGlobalState } from '@/lib/state';
import { cn, swapLastUrlSubpath } from '@/lib/utils';
import DifficultyCarousel from './DifficultyCarousel';

interface ResetSetupProps<T extends string, U extends { status: string }> {
  status: string;
  reset: (difficulty?: T, state?: U) => void;
  difficulties: T[];
  className?: string;
}
const ResetSetup = <T extends string, U extends { status: string }>({
  status,
  reset,
  difficulties,
  className,
}: ResetSetupProps<T, U>) => {
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const { setState } = useGlobalState();

  const disableResume = status === 'create';

  return (
    <>
      <div className={cn('flex w-full flex-col items-center gap-2', className)}>
        <DifficultyCarousel
          difficulty={difficulty}
          difficulties={difficulties}
          setDifficulty={setDifficulty}
        />
        <Link
          to={swapLastUrlSubpath(useLocation().pathname, '/play')}
          className="w-full"
        >
          <Button
            onClick={() => {
              setState({ navDirection: 'right' });
              reset(difficulty);
            }}
            variant="outline"
            className="w-full rounded-full border border-border hover:bg-secondary"
          >
            New game
          </Button>
        </Link>
      </div>
      <Link
        to={swapLastUrlSubpath(useLocation().pathname, '/play')}
        className={`w-full ${disableResume ? 'pointer-events-none' : ''}`}
      >
        <Button
          onClick={() => {
            setState({ navDirection: 'right' });
          }}
          variant="outline"
          className="w-full rounded-full border border-border hover:bg-secondary"
          disabled={disableResume}
        >
          Resume game
        </Button>
      </Link>
    </>
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
            className="w-full rounded-full border border-border hover:bg-secondary"
          >
            Clear game
          </Button>
        </DialogClose>
      )}
      <DialogClose asChild>
        <Button
          onClick={() => reset()}
          variant="outline"
          className="w-full rounded-full border border-border hover:bg-secondary"
        >
          New game
        </Button>
      </DialogClose>
    </div>
  );
};

interface ResetPromptProps<T extends string> {
  reset: (difficulty: T) => void;
  difficulties: T[];
}

const ResetPrompt = <T extends string>({
  reset,
  difficulties,
}: ResetPromptProps<T>) => {
  const [difficulty, setDifficulty] = useState(difficulties[0]);

  return (
    <div className="mb-6 flex w-[90svw] items-center justify-evenly gap-x-4">
      <Button
        onClick={() => reset(difficulty)}
        variant="outline"
        className="w-[45%] rounded-full border border-border hover:bg-secondary"
      >
        New game
      </Button>
      <DifficultyCarousel
        difficulty={difficulty}
        difficulties={difficulties}
        setDifficulty={setDifficulty}
        className="w-[45%]"
      />
    </div>
  );
};

export { ResetSetup, ResetDialog, ResetPrompt };
