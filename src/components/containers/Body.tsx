import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useIsPresent } from 'framer-motion';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useGlobalState } from '@/lib/state';

const bodyVariants = cva('flex flex-grow flex-col items-center', {
  variants: {
    variant: {
      menu: 'justify-center',
      create: 'w-1/2 min-w-72 justify-center gap-y-8',
      play: 'w-full justify-evenly',
    },
  },
  defaultVariants: {
    variant: 'menu',
  },
});

interface BodyProps extends VariantProps<typeof bodyVariants> {
  className?: string;
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ variant, className, children }) => {
  const { navDirection, setState } = useGlobalState();
  const isPresent = useIsPresent();

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
