import { GameStatus } from '@/lib/types';
import { motion } from 'framer-motion';
import React from 'react';

interface FooterProps {
  status?: GameStatus;
  reset?: React.ReactNode;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ status, reset, children }) => {
  return (
    <motion.div
      key="footer"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="relative flex h-[8svh] w-screen items-center justify-evenly p-1"
    >
      <div className="absolute inset-0 -z-10 brightness-95" />
      {status !== 'finished' ? children : reset}
    </motion.div>
  );
};

export default Footer;
