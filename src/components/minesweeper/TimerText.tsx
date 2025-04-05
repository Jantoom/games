import React, { useEffect, useRef } from 'react';
import { formatTime } from '@/lib/utils';
import { useMinesweeperState } from '@/states/minesweeperState';

const TimerText: React.FC = () => {
  const { isActive, time, setState } = useMinesweeperState();
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

  return <span className="pl-1 text-2xl font-medium">{formatTime(time)}</span>;
};

export default TimerText;
