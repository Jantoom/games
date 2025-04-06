import React, { useEffect, useRef } from 'react';
import { formatTime } from '@/lib/utils';
import { useSudokuState } from '../sudokuState';
import { Label } from '@/components/ui/label';

const TimerText: React.FC = () => {
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

  return <Label className="text-2xl font-medium">{formatTime(time)}</Label>;
};

export default TimerText;
