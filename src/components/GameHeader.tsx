import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const GameHeader: React.FC<GameHeaderProps> = ({ className, children }) => {
  return (
    <motion.div
      key="cell"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="relative h-[8%] w-full"
    >
      <div className="absolute inset-0 rounded-b-full bg-secondary opacity-50" />
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-evenly px-8 py-2',
          className,
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default GameHeader;
