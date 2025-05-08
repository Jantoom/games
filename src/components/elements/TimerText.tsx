import React from 'react';
import { Label } from '@/components/ui/label';
import { cn, formatTime } from '@/lib/utils';

interface TimerTextProps {
  time: number;
  className?: string;
}
const TimerText: React.FC<TimerTextProps> = ({ time, className }) => {
  return (
    <Label className={cn('relative w-full text-center font-medium', className)}>
      {formatTime(time)}
    </Label>
  );
};

export default TimerText;
