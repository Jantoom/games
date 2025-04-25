import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useIsPresent } from 'framer-motion';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useGlobalState } from '@/lib/state';

const bodyVariants = cva('flex flex-grow flex-col items-center', {
  variants: {
    variant: {
      menu: '',
      create: 'w-[80svw] justify-center gap-y-8',
      play: 'w-full justify-evenly',
    },
  },
  defaultVariants: {
    variant: 'menu',
  },
});

interface BodyProps extends VariantProps<typeof bodyVariants> {
  save?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ save, variant, className, children }) => {
  const { navDirection, setState } = useGlobalState();
  const isPresent = useIsPresent();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [variant, setState]);

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
      key={variant}
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
      className={cn(bodyVariants({ variant, className }))}
    >
      {children}
    </motion.div>
  );
};
Body.displayName = 'Body';

export default Body;
