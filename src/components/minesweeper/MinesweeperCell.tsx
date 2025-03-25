import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CellNotes } from '@/lib/sudokuTypes';

interface MinesweeperCellProps {
  num: number;
  onClick: () => void;
}

const MinesweeperCell: React.FC<MinesweeperCellProps> = ({
  num,
  onClick,
}) => {
  const randomDelay = Math.random() * 0.1;
  return (
    <div
      className={`w-full aspect-square ${num === -1 ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <motion.div
        key="cell"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: randomDelay * 2 }}
        className={`relative flex w-full h-full items-center justify-center ${num === -1 ? 'bg-primary' : ''}`}
      >
        <AnimatePresence mode="sync">
        <motion.span
              key={num}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`absolute text-[min(4vw,2vh)] font-medium select-none transition-colors text-primary`}
            >
              {num > 0 ? num : ''}
            </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MinesweeperCell;
