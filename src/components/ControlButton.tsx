import { LucideProps } from 'lucide-react';
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface ControlButtonProps extends ButtonProps {
  isSelected: boolean;
  Icon?: React.FC<LucideProps> | undefined;
}

const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ isSelected, Icon, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant={isSelected ? 'default' : 'ghost'}
      className={`aspect-square h-full rounded-full hover:bg-secondary ${isSelected ? 'text-background' : ''} ${className}`}
      {...props}
    >
      {Icon === undefined ? <></> : <Icon />}
    </Button>
  ),
);
ControlButton.displayName = 'ControlButton';

export default ControlButton;
