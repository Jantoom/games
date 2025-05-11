import { motion, AnimatePresence } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';
import { use2048Store } from '@/games/2048/state';
import { adjustHsl, rgbToHsl } from '@/lib/utils';
import { useGlobalStore } from '@/lib/state';
import { ThemeColors, Themes } from '@/lib/styles';

const backgroundStyles: [keyof ThemeColors[string], [number, number]][] = [
  // Styles reset for larger numbers
  ['muted', [0, 2]], // 2
  ['muted', [20, -4]], // 4
  ['muted', [40, -10]], // 8
  ['secondary', [60, 2]], // 16
  ['secondary', [80, -4]], // 32
  ['secondary', [100, -10]], // 64
  ['accent', [40, 2]], // 128
  ['accent', [60, -4]], // 256
  ['accent', [80, -10]], // 512
  ['primary', [100, 2]], // 1024
  ['primary', [120, -4]], // 2048
  ['primary', [140, -10]], // 4096
];

const digitsSizes: { [key: number]: string } = {
  1: 'text-sm',
  2: 'text-sm',
  3: 'text-sm',
  4: 'text-xs',
  5: 'text-2xs',
  6: 'text-3xs',
  7: 'text-3xs',
  8: 'text-3xs',
};

interface CellProps {
  id: number;
  row: number;
  col: number;
  num: number;
  factor: number;
}

const Cell: React.FC<CellProps> = ({ id, row, col, num, factor }) => {
  const { mode, theme } = useGlobalStore();
  const { setState } = use2048Store();
  const [scale, setScale] = useState(1);
  const [prevValue, setPrevValue] = useState(num);
  const displayNum = (num > 0 ? num : prevValue) * 1;
  const numDigits = Math.floor(Math.log10(displayNum)) + 1;

  useMemo(() => {
    if (num != 0) {
      setPrevValue(() => {
        if (num > prevValue) {
          setScale(1.05);
          setTimeout(() => {
            setScale(1);
          }, 150);
        }
        return num;
      });
    }
  }, [num]);

  const numToColor = useCallback(
    (num: number) => {
      const [alias, [ds, dl]] =
        backgroundStyles[
          (Math.floor(Math.log2(num)) - 1) % backgroundStyles.length
        ];
      const hsl = rgbToHsl(Themes[mode][theme][alias]);
      return adjustHsl(hsl, 0, ds, dl);
    },
    [mode, theme],
  );

  return (
    <motion.div
      key={id}
      initial={{
        x: col * factor,
        y: row * factor,
        scale: 0,
      }}
      animate={{ x: col * factor, y: row * factor, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`${num === 0 ? 'z-10' : 'z-20'} absolute flex items-center justify-center`}
      style={{ height: factor, width: factor }}
      onAnimationComplete={() => {
        if (num === 0) {
          setState((prev) => ({
            cells: prev.cells.filter((cell) => cell.id !== id),
          }));
        }
      }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg ${displayNum}`}
          className="absolute inset-0.5"
          animate={{ opacity: 1, scale: scale }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          style={{ background: numToColor(displayNum) }}
        />
        <span
          key={`text ${displayNum}`}
          className={`${digitsSizes[numDigits]} absolute`}
        >
          {displayNum}
        </span>
      </AnimatePresence>
    </motion.div>
  );
};

export default Cell;
