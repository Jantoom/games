import { motion } from 'framer-motion';
import React from 'react';

interface BodyProps {
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => {
  return (
    <motion.div
      key="body"
      initial={{ scale: 0.85 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.85 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="flex w-full flex-grow flex-col items-center justify-evenly"
    >
      {children}
    </motion.div>
  );
};

export default Body;
