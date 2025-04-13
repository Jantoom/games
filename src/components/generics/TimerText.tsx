import React, { useEffect, useRef, useState } from 'react';
import { cn, formatTime } from '@/lib/utils';
import { Label } from '../ui/label';

interface TimerTextProps {
  className?: string;
  initial: number;
  active: boolean;
  tick: () => number;
}
const TimerText: React.FC<TimerTextProps> = ({ className, initial, active, tick }) => {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [time, setTime] = useState(initial);

  useEffect(() => {
    if (active) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTime(tick());
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [active, tick]);

  return (
    <Label
      className={cn('w-full text-center text-[3svh] font-medium', className)}
    >
      {formatTime(time)}
    </Label>
  );
};

export default TimerText;
