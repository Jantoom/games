import { motion } from 'framer-motion';
import React, { useState } from 'react';
import DialogButton from '../generics/DialogButton';
import { RotateCcw } from 'lucide-react';

interface FooterProps {
  reset?: React.ReactNode;
  children: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ reset, children }) => {
  const [isResetOpen, setIsResetOpen] = useState(false);

  return (
    <motion.div
      layout
      key="footer"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="relative flex h-[6svh] w-screen justify-between px-[2.5vw]"
    >
      <div className="absolute inset-0 rounded-t-[40px] bg-secondary brightness-95" />
      <div className="relative flex h-full w-full items-center justify-evenly">
        <DialogButton
          Icon={RotateCcw}
          title="Reset game?"
          isOpen={isResetOpen}
          setIsOpen={setIsResetOpen}
        >
          {reset}
        </DialogButton>
        {children}
      </div>
    </motion.div>
  );
};

export default Footer;
