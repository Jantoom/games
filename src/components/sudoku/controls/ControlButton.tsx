import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { LucideProps } from 'lucide-react';

interface ControlButtonProps extends ButtonProps {
  isSelected: boolean;
  Icon?: React.FC<LucideProps> | null;
}

const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ isSelected, Icon, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant={isSelected ? 'default' : 'ghost'}
      className={`w-[10%] h-auto aspect-square rounded-full hover:bg-secondary ${isSelected ? 'text-background' : ''} ${className}`}
      {...props}
    >
      {Icon !== null ? <Icon /> : <></>}
    </Button>
  ),
);
ControlButton.displayName = 'ControlButton';

export default ControlButton;
