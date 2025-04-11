import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

interface AnimatedPageProps {
  depth: number;
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ depth, children }) => {
  const direction = depth === 1 ? 1 : -1;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div
      layout
      key="page"
      initial={{ opacity: 0, x: 100 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 * direction }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex h-svh flex-col items-center px-[2.5vw]"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
