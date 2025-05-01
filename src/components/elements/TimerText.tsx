import React, { useEffect, useRef, useState } from 'react';
import { cn, formatTime } from '@/lib/utils';
import { Label } from '../ui/label';
import { GameStatus } from '@/lib/types';

interface TimerTextProps {
  className?: string;
  init: number;
  status: GameStatus;
  tick: () => number;
}
const TimerText: React.FC<TimerTextProps> = ({
  className,
  init,
  status,
  tick,
}) => {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [time, setTime] = useState(init);

  useEffect(() => {
    if (status === 'play') {
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
  }, [status, tick]);

  return (
    <Label
      className={cn('relative w-full text-center font-medium', className)}
    >
      {formatTime(time)}
    </Label>
  );
};

export default TimerText;
