import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CellNotes } from '@/lib/sudokuTypes';

interface SudokuCellProps {
  num: number;
  isOriginal: boolean;
  isHighlighted: boolean;
  isFlagged: boolean;
  notes: CellNotes | undefined;
  onClick: () => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  num,
  isOriginal,
  isHighlighted,
  isFlagged,
  notes,
  onClick,
}) => {
  const randomDelay = Math.random() * 0.1;
  return (
    <div
      className={`w-full aspect-square p-[10%] ${!isOriginal ? 'cursor-pointer' : ''}`}
      onClick={onClick}
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
        className={`relative flex w-full h-full items-center justify-center`}
      >
        <AnimatePresence mode="sync">
          {isOriginal && (
            <div
              key="original"
              className={`absolute inset-0 rounded-full bg-secondary`}
            />
          )}
          {isHighlighted && (
            <motion.div
              key="highlight"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
                delay: randomDelay,
              }}
              className={`absolute inset-0 rounded-full bg-primary`}
            />
          )}
          {isFlagged && (
            <motion.div
              key="flag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`absolute inset-0 rounded-full bg-destructive`}
            />
          )}

          {num != 0 ? (
            <motion.span
              key={num}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`absolute text-[min(4vw,2vh)] font-medium select-none transition-colors ${isHighlighted || isFlagged ? 'text-background' : isOriginal ? 'text-border' : 'text-primary'}`}
            >
              {num ? num : ''}
            </motion.span>
          ) : (
            notes.size > 0 && (
              <motion.div
                key={JSON.stringify([...notes])}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute flex flex-wrap justify-center gap-y-[0.1vh] w-[70%]"
              >
                {Array.from({ length: 9 }).map(
                  (_, i) =>
                    notes?.has(i + 1) && (
                      <span
                        key={i}
                        className={`text-[min(2.25vw,1.125vh)] w-1/3 font-medium leading-none text-center select-none transition-colors ${isHighlighted ? 'text-background' : 'text-primary'}`}
                      >
                        {i + 1}
                      </span>
                    ),
                )}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SudokuCell;
