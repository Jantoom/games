import { GameStatus } from '@/lib/types';
import { useEffect, useRef } from 'react';

export const useTimer = (status: GameStatus, tick: () => void) => {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (status === 'play') {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        tick();
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
};
