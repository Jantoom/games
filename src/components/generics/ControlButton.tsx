import { LucideProps } from 'lucide-react';
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ControlButtonProps extends ButtonProps {
  Icon: React.FC<LucideProps>;
  isSelected: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  Icon,
  isSelected,
  onClick,
  className,
  ...props
}) => {
  return (
    <Button
      variant={isSelected ? 'default' : 'ghost'}
      onClick={onClick}
      className={cn(
        `h-full rounded-full hover:bg-secondary py-0 ${isSelected ? 'bg-primary' : ''}`,
        className,
      )}
      {...props}
    >
      {Icon !== undefined && (
        <Icon
          className="stroke-foreground"
          style={{ height: '100%' }}
        />
      )}
    </Button>
  );
};
ControlButton.displayName = 'ControlButton';

export default ControlButton;
