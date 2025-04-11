import React from 'react';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
const Reset: React.FC<{
  reset: () => void;
  restart?: () => void;
  className?: string;
}> = ({ reset, restart, className }) => {
  return (
    <div className={cn('flex flex-row gap-2', className)}>
      {restart && <DialogClose asChild>
        <Button
          onClick={restart}
          variant="outline"
          className="w-full border border-border hover:bg-secondary"
        >
          Clear game
        </Button>
      </DialogClose>}
      <DialogClose asChild>
        <Button
          onClick={reset}
          variant="outline"
          className="w-full border border-border hover:bg-secondary"
        >
          New game
        </Button>
      </DialogClose>
    </div>
  );
};

export default Reset;
