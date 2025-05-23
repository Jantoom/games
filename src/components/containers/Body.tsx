import { cva } from 'class-variance-authority';
import { motion, useIsPresent } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalStore } from '@/lib/state';
import { PagePath, pagePaths } from '@/lib/types';
import { cn } from '@/lib/utils';

const bodyVariants = cva('flex flex-grow w-full flex-col items-center', {
  variants: {
    variant: {
      menu: 'max-w-72 justify-center gap-y-8',
      create: 'max-w-72 justify-center gap-y-8',
      settings: 'max-w-72 justify-center gap-y-8',
      leaderboard: 'max-w-72 justify-center gap-y-8',
      play: 'justify-evenly',
    },
  },
  defaultVariants: {
    variant: 'menu',
  },
});

interface BodyProps {
  className?: string;
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ className, children }) => {
  const { navDirection, setState } = useGlobalStore();
  const isPresent = useIsPresent();
  const subpath = useLocation().pathname.split('/').pop();
  const [variant, _setVariant] = useState<PagePath>(
    pagePaths.includes(subpath as PagePath) ? (subpath as PagePath) : 'menu',
  );

  useEffect(() => {
    setState({ navDirection: undefined });
  }, [setState]);

  return (
    <motion.div
      key={variant}
      initial={{
        opacity: 0,
        x:
          navDirection === 'left'
            ? isPresent
              ? -100
              : 100
            : navDirection === 'right'
              ? isPresent
                ? 100
                : -100
              : 0,
      }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x:
          navDirection === 'left'
            ? isPresent
              ? -100
              : 100
            : navDirection === 'right'
              ? isPresent
                ? 100
                : -100
              : 0,
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={cn(bodyVariants({ variant, className }))}
    >
      {children}
    </motion.div>
  );
};
Body.displayName = 'Body';

export default Body;
