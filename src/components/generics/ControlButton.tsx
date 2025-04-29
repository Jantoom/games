import { LucideProps } from 'lucide-react';
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ControlButtonProps extends ButtonProps {
  Icon: React.FC<LucideProps>;
  isSelected: boolean;
}

const ControlButton = React.forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ Icon, isSelected, onClick, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={isSelected ? 'default' : 'ghost'}
        onClick={onClick}
        className={cn(
          `h-full rounded-full`,
          className,
        )}
        {...props}
      >
        {Icon !== undefined && <Icon className="h-1/2 hover:stroke-accent-foreground" />}
      </Button>
    );
  },
);
ControlButton.displayName = 'ControlButton';

export default ControlButton;
