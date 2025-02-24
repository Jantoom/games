import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';

export interface TimerTextHandles {
    getTimer: () => number;
    clearTimer: () => void;
};

export const TimerText = forwardRef<TimerTextHandles>((props, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [timer, setTimer] = useState(0);

  useImperativeHandle(ref, () => ({
    getTimer: () => timer,
            clearTimer: () => {    setIsActive(true);
                setTimer(0);}
          }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => setIsActive(true), []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  return (
    <span className="text-lg font-medium text-game-gridline">{formatTime(timer)}</span>
  );
});
