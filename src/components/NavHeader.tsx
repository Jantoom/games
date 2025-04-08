import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

interface NavHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const NavHeader: React.FC<NavHeaderProps> = ({ className, children }) => {
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
      <div className="absolute inset-0 bg-primary opacity-50" />
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-between p-2',
          className,
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default NavHeader;
