import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface GameFooterProps {
  className?: string;
  children: React.ReactNode;
}

const GameFooter: React.FC<GameFooterProps> = ({ className, children }) => {
  return (
    <motion.div
      key="cell"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="relative h-[8%] w-full"
    >
      <div className="absolute inset-0 rounded-t-full bg-secondary opacity-50" />
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-evenly p-2',
          className,
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default GameFooter;
