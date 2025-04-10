import { motion } from 'framer-motion';
import React from 'react';

interface FooterProps {
  children: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
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
      className="relative flex h-[6svh] w-screen justify-between px-2"
    >
      <div className="absolute inset-0 rounded-t-[40px] bg-secondary brightness-95" />
      <div className="relative flex h-full w-full items-center justify-evenly">
        {children}
      </div>
    </motion.div>
  );
};

export default Footer;
