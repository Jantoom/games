import { useGamesState } from '@/lib/state';
import { PageDepth } from '@/lib/types';
import { motion, useIsPresent } from 'framer-motion';
import React, { useEffect } from 'react';

interface AnimatedPageProps {
  pageDepth: PageDepth;
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ pageDepth, children }) => {
  const { navDirection, setState } = useGamesState();
  const isPresent = useIsPresent();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pageDepth, setState]);

  return (
    <motion.div
      key={pageDepth}
      initial={{
        opacity: 0,
        x: isPresent
          ? navDirection === 'left'
            ? -100
            : 100
          : navDirection === 'left'
            ? 100
            : -100,
      }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: isPresent
          ? navDirection === 'left'
            ? -100
            : 100
          : navDirection === 'left'
            ? 100
            : -100,
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex h-svh flex-col items-center px-[2.5vw]"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
