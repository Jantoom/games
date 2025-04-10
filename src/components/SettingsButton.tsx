import { Settings } from 'lucide-react';
import React, { useState } from 'react';
import ControlButton from './generics/ControlButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';

interface SettingsButtonsProps {
  children: React.ReactNode;
  className?: string;
}

const SettingsButton: React.FC<SettingsButtonsProps> = ({
  className,
  children,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isSettingsOpen}
          Icon={Settings}
          onClick={() => setIsSettingsOpen(true)}
          className={cn(className, 'relative')}
        />
      </DialogTrigger>
      <DialogContent>
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
