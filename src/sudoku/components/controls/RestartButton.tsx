import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useSudokuState } from '@/sudoku/state';
import DialogButton from '@/components/generics/DialogButton';

const RestartButton: React.FC = () => {
  const { isActive, restart } = useSudokuState();
  const [isRestartOpen, setIsRestartOpen] = useState(false);

  return (
    <DialogButton
      Icon={RotateCcw}
      title="Are you sure you want to restart?"
      isOpen={isRestartOpen}
      setIsOpen={setIsRestartOpen}
      disabled={!isActive}
    >
      <DialogClose asChild>
        <Button
          onClick={restart}
          variant="outline"
          className="w-full border border-border hover:bg-secondary"
        >
          Yes
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button
          variant="outline"
          className="w-full border border-border hover:bg-secondary"
        >
          No
        </Button>
      </DialogClose>
    </DialogButton>
  );
};

export default RestartButton;
