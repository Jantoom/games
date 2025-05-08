import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Flag } from 'lucide-react';
import React from 'react';

interface CellProps {
  id: string;
  num: number;
  flagged: boolean;
  exploded: boolean;
}

const Cell: React.FC<CellProps> = ({ id, num, flagged, exploded }) => {
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
          <motion.div
            key={`${flagged}${exploded}${num}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute"
          >
            {exploded ? (
              <Bomb className="fill-accent stroke-primary" />
            ) : flagged ? (
              <Flag className="fill-accent stroke-primary" />
            ) : (
              <span className="select-none text-lg font-medium text-primary">
                {num > 0 ? num : ''}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Cell;
