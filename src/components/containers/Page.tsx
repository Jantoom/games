import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PageProps {
  seed?: string;
  save?: () => void;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ seed, save, children }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
      save();
    };
    if (save) window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (save) window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [save]);

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
