import React, { useEffect, useRef } from 'react';
import { cn, formatTime } from '@/lib/utils';
import { useSudokuState } from '../sudokuState';

const TimerText: React.FC<{ className?: string }> = ({ className }) => {
  const { isActive, time, setState } = useSudokuState();
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (isActive) {
      if (timerRef.current) clearInterval(timerRef.current); // Ensure only one interval runs
      timerRef.current = setInterval(() => {
        setState((prevState) => ({ time: prevState.time + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined; // Reset ref
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [isActive, setState]);

  return (
    <span className={cn('font-medium', className)}>{formatTime(time)}</span>
  );
};

export default TimerText;
