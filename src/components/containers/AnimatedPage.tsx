import { motion, useIsPresent } from 'framer-motion';
import React, { useEffect } from 'react';
import { useGlobalState } from '@/lib/state';
import { PageDepth } from '@/lib/types';

interface AnimatedPageProps {
  pageDepth: PageDepth;
  save?: () => void;
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({
  pageDepth,
  save,
  children,
}) => {
  const { navDirection, setState } = useGlobalState();
  const isPresent = useIsPresent();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pageDepth, setState]);

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
