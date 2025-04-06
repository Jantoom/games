import { DialogDescription } from '@radix-ui/react-dialog';
import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import ControlButton from '@/components/ControlButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSudokuState } from '@/states/sudokuState';

interface RestartButtonProps {
  restart: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ restart }) => {
  const { isActive } = useSudokuState();
  const [isRestartOpen, setIsRestartOpen] = useState(false);

  return (
    <Dialog open={isRestartOpen} onOpenChange={setIsRestartOpen}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isRestartOpen}
          Icon={RotateCcw}
          onClick={() => setIsRestartOpen(true)}
          disabled={!isActive}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[90%] border-border [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">
            Are you sure you want to restart?
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};

export default RestartButton;
