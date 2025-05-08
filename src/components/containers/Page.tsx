import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

interface PageProps {
  seed?: string;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ seed, children }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div
      key={seed ? seed : 'page'}
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
