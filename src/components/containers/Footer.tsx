import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
  children: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ className, children }) => {
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
      className="flex relative h-[6svh] w-full justify-center"
    >
      <div className="absolute inset-y-0 w-screen rounded-t-[40px] bg-secondary brightness-95" />
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-evenly px-2',
          className,
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default Footer;
