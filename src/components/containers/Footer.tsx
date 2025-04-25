import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import DialogButton from '../generics/DialogButton';

interface FooterProps {
  reset?: React.ReactNode;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ reset, children }) => {
  const [isResetOpen, setIsResetOpen] = useState(false);

  return (
    <motion.div
      key="footer"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="relative flex h-[8svh] w-screen items-center justify-evenly p-1"
    >
      <div className="absolute inset-0 -z-10 brightness-95" />
      {reset && (
        <DialogButton
          Icon={RotateCcw}
          title="Reset game?"
          isOpen={isResetOpen}
          setIsOpen={setIsResetOpen}
        >
          {reset}
        </DialogButton>
      )}
      {children}
    </motion.div>
  );
};

export default Footer;
