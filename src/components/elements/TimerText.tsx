import React from 'react';
import { cn, formatTime } from '@/lib/utils';
import { Label } from '../ui/label';

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
