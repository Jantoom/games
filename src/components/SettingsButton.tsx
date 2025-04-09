import { Settings } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import ControlButton from '@/components/ControlButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const SettingsButton = ({ children }: PropsWithChildren) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isSettingsOpen}
          Icon={Settings}
          onClick={() => setIsSettingsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[90%] border-border">
        <DialogHeader>
          <DialogTitle className="text-center">Settings</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsButton;
