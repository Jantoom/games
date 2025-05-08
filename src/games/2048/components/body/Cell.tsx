import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { CellNotes } from '@/games/2048/types';
import { cn } from '@/lib/utils';

interface CellProps {
  num: number;
  original: boolean;
  highlighted: boolean;
  flagged: boolean;
  notes: CellNotes | undefined;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({
  num,
  original,
  highlighted,
  flagged,
  notes,
  onClick,
}) => {
  const randomDelay = Math.random() * 0.2;
  return (
    <div
      className={`aspect-square h-full w-full p-[10%] ${original ? '' : 'cursor-pointer'}`}
      onClick={onClick}
    >
      <motion.div
        key="cell"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
          delay: randomDelay,
        }}
        className={`relative flex h-full w-full items-center justify-center`}
      >
        <AnimatePresence mode="sync">
          {original && (
            <div
              key="original"
              className={`absolute inset-0 rounded-full bg-secondary`}
            />
          )}
          {highlighted && (
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
          {flagged && (
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
                className="absolute flex w-[70%] flex-wrap justify-center gap-y-[1.5px]"
              >
                {Array.from({ length: 9 }).map(
                  (_, index) =>
                    notes.has(index + 1) && (
                      <span
                        key={index}
                        className={`w-1/3 select-none text-center text-xs font-medium leading-none transition-colors ${highlighted ? 'text-background' : 'text-primary'}`}
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
              className={cn(
                `absolute select-none text-2xl font-medium transition-colors`,
                `${highlighted ? 'text-primary-foreground' : flagged ? 'text-destructive-foreground' : original ? 'text-secondary-foreground' : 'text-primary'}`,
              )}
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
