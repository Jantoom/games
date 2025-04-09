import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { CellNotes } from '@/sudoku/types';

interface CellProps {
  num: number;
  isOriginal: boolean;
  isHighlighted: boolean;
  isFlagged: boolean;
  notes: CellNotes | undefined;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({
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
      className={`aspect-square h-full w-full p-[10%] ${isOriginal ? '' : 'cursor-pointer'}`}
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
        className={`relative flex h-full w-full items-center justify-center`}
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

          {num == 0 ? (
            notes != undefined &&
            notes.size > 0 && (
              <motion.div
                key={JSON.stringify([...notes])}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute flex w-[70%] flex-wrap justify-center gap-y-[0.1vh]"
              >
                {Array.from({ length: 9 }).map(
                  (_, index) =>
                    notes.has(index + 1) && (
                      <span
                        key={index}
                        className={`w-1/3 select-none text-center text-[min(2.25vw,1.125vh)] font-medium leading-none transition-colors ${isHighlighted ? 'text-background' : 'text-primary'}`}
                      >
                        {index + 1}
                      </span>
                    ),
                )}
              </motion.div>
            )
          ) : (
            <motion.span
              key={`${num}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`absolute select-none text-[min(4vw,2vh)] font-medium transition-colors ${isHighlighted || isFlagged ? 'text-background' : isOriginal ? 'text-border' : 'text-primary'}`}
            >
              {num ?? ''}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Cell;
