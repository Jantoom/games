import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Flag } from 'lucide-react';
import { Themes } from '@/lib/styles';
import { useGlobalState } from '@/states/globalState';

interface MinesweeperCellProps {
  id: string;
  num: number;
  isFlagged: boolean;
  isExploded: boolean;
}

const MinesweeperCell: React.FC<MinesweeperCellProps> = ({
  id,
  num,
  isFlagged,
  isExploded,
}) => {
  const { theme } = useGlobalState();
  const randomDelay = Math.random() * 0.1;

  return (
    <div
      data-id={id}
      className={`w-full aspect-square ${num === null ? 'cursor-pointer' : ''}`}
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
        className={`relative flex w-full h-full items-center justify-center ${(num === null && !isFlagged) || isExploded ? 'bg-secondary' : ''}`}
      >
        <AnimatePresence mode="sync">
          {isFlagged || isExploded ? (
            <motion.div
              key={`${isFlagged}${isExploded}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`absolute text-lg font-medium select-none transition-colors text-primary`}
            >
              {isExploded ? (
                <Bomb className="stroke-background" fill="black" />
              ) : (
                <Flag
                  className="stroke-primary"
                  fill={Themes[theme].secondary}
                />
              )}
            </motion.div>
          ) : (
            <motion.span
              key={num}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`absolute text-lg font-medium select-none transition-colors text-primary`}
            >
              {num > 0 ? num : ''}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MinesweeperCell;
