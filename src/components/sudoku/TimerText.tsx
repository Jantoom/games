import { formatTime } from "@/lib/utils"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

export interface TimerTextHandles {
  getTime: () => number;
}

interface TimerTextProps {
  isActive: boolean;
};

export const TimerText = forwardRef<TimerTextHandles, TimerTextProps>(({ isActive }, ref) => {
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    getTime: () => time,
  }));

  useEffect(() => {
    if (isActive) {
      if (timerRef.current) clearInterval(timerRef.current); // Ensure only one interval runs
      timerRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null; // Reset reference
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  return <span className="text-2xl font-medium transition-colors duration-300 ease-in-out">{formatTime(time)}</span>
})