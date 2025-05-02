import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Flag } from 'lucide-react';
import React from 'react';
import { Themes } from '@/lib/styles';
import { useGlobalStore } from '../../../lib/state';

interface CellProps {
  id: string;
  num: number;
  flagged: boolean;
  exploded: boolean;
}

const Cell: React.FC<CellProps> = ({ id, num, flagged, exploded }) => {
  const { mode, theme } = useGlobalStore();
  const randomDelay = Math.random() * 0.1;

  return (
    <div
      data-id={`${id}`}
      className={`aspect-square w-full ${num == undefined ? 'cursor-pointer' : ''}`}
    >
      <motion.div
        key="cell"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
          delay: randomDelay * 2,
        }}
        className={`relative flex h-full w-full items-center justify-center ${(num == undefined && !flagged) || exploded ? 'bg-secondary' : ''}`}
      >
        <AnimatePresence mode="sync">
          {flagged || exploded ? (
            <motion.div
              key={`${flagged}${exploded}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`absolute select-none text-lg font-medium text-primary transition-colors`}
            >
              {exploded ? (
                <Bomb className="stroke-background" fill="black" />
              ) : (
                <Flag
                  className="stroke-primary"
                  fill={`rgb(${Themes[mode][theme].secondary})`}
                />
              )}
            </motion.div>
          ) : (
            <motion.span
              key={`${num}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`absolute select-none text-lg font-medium text-primary transition-colors`}
            >
              {num > 0 ? num : ''}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Cell;
