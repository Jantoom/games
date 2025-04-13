import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

interface BodyProps {
  className?: string;
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ className, children }) => {
  return (
    <motion.div
      layout
      key="body"
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      exit={{ scale: 1 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className={cn(
        'flex w-full flex-grow flex-col items-center justify-evenly',
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export default Body;
