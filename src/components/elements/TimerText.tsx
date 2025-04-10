import { useEffect, useRef, useState } from 'react';
import { cn, formatTime } from '@/lib/utils';
import { Label } from '../ui/label';

interface TimerTextProps<T extends { time: number }> {
  className?: string;
  isActive: boolean;
  set: (newState: { time: number } | ((state: T) => { time: number })) => void;
}
const TimerText = <T extends { time: number }>({
  className,
  isActive,
  set,
}: TimerTextProps<T>) => {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (isActive) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        set((prevState: T) => {
          const newTime = prevState.time + 1;
          setTime(newTime);
          return { time: newTime };
        });
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
  }, [isActive, set]);

  return (
    <Label className={cn('font-medium w-full text-center text-[3svh]', className)}>{formatTime(time)}</Label>
  );
};

export default TimerText;
