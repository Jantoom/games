import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ControlButton from '../../ControlButton';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

interface RestartButtonProps {
  restart: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ restart }) => {
  const [isRestartOpen, setIsRestartOpen] = useState(false);

  const close = () => setIsRestartOpen(false);

  return (
    <Dialog onOpenChange={(isOpen) => (isOpen ? null : close())}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isRestartOpen}
          Icon={RotateCcw}
          onClick={() => setIsRestartOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="border-border [&>button:last-child]:hidden">
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
