import { LucideProps } from 'lucide-react';
import React from 'react';
import ControlButton from '@/components/generics/ControlButton';
import { ButtonProps } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DialogButtonProps extends ButtonProps {
  Icon: React.FC<LucideProps>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  className?: string;
  children?: React.ReactNode;
}

const DialogButton: React.FC<DialogButtonProps> = ({
  Icon,
  isOpen,
  setIsOpen,
  title,
  className,
  children,
  ...props
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ControlButton
          Icon={Icon}
          isSelected={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className={className}
          {...props}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
DialogButton.displayName = 'DialogButton';

export default DialogButton;
