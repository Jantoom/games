import { useEffect, useRef, useState } from 'react';
import { cn, formatTime } from '@/lib/utils';

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
    <span className={cn('font-medium', className)}>{formatTime(time)}</span>
  );
};

export default TimerText;
