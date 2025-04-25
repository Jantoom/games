import React from 'react';
import { motion } from 'framer-motion';

interface PageProps {
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <motion.div
      key="page"
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      exit={{ scale: 1 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="flex h-svh flex-col items-center"
    >
      {children}
    </motion.div>
  );
};

export default Page;
