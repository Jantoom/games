import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { cn, swapLastUrlSubpath } from '@/lib/utils';
import DifficultyCarousel from './DifficultyCarousel';
import { Link, useLocation } from 'react-router-dom';
import { useGamesState } from '@/lib/state';

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

interface ResetSetupProps<T extends string, U extends { status: string }> {
  status: string;
  read: () => U | undefined;
  reset: (difficulty?: T, state?: U) => void;
  difficulties: T[];
  className?: string;
}
const ResetSetup = <T extends string, U extends { status: string }>({
  status,
  read,
  reset,
  difficulties,
  className,
}: ResetSetupProps<T, U>) => {
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const saveData = read();
  const { setState } = useGamesState();

  const disableLoadPrevious = status !== 'play' && saveData?.status !== 'play';

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
        className={`w-full ${disableLoadPrevious ? 'pointer-events-none' : ''}`}
      >
        <Button
          onClick={() => {
            setState({ navDirection: 'right' });
            if (status !== 'play') reset(undefined, saveData);
          }}
          variant="outline"
          className="w-full rounded-full border border-border hover:bg-secondary"
          disabled={disableLoadPrevious}
        >
          Load previous game
        </Button>
      </Link>
    </>
  );
};

export { ResetDialog, ResetSetup };
