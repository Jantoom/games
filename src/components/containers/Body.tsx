import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

const bodyVariants = cva('flex flex-grow flex-col items-center', {
  variants: {
    variant: {
      default: '',
      setup: 'w-[80svw] justify-center gap-y-8',
      play: 'w-full justify-evenly',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface BodyProps extends VariantProps<typeof bodyVariants> {
  className?: string;
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ variant, className, children }) => {
  return (
    <motion.div
      layout
      key="body"
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      exit={{ scale: 1 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className={cn(bodyVariants({ variant, className }))}
    >
      {children}
    </motion.div>
  );
};
Body.displayName = 'Body';

export default Body;
