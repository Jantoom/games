import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedPageProps {
  depth: number;
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ depth, children }) => {
  let direction = depth === 1 ? 1 : -1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 * direction }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
