import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import BackButton from '../elements/BackButton';
import DialogButton from '../generics/DialogButton';
import { Settings } from 'lucide-react';

interface HeaderProps {
  settings?: React.ReactNode;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ settings, children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <motion.div
        key="header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
        className={`relative flex h-[6svh] w-screen items-center justify-between px-2`}
      >
        <div
          className={`absolute inset-0 bg-primary brightness-95 transition-[border-radius] duration-500 ease-in-out ${children ? 'rounded-b-[0px]' : 'rounded-b-[40px]'}`}
        />
        <BackButton cleanup={() => {}} />
        <div className="absolute left-1/2 h-full w-52 -translate-x-1/2 rounded-full bg-primary" />
        <DialogButton
          Icon={Settings}
          title="Settings"
          isOpen={isSettingsOpen}
          setIsOpen={setIsSettingsOpen}
          className='relative'
        >
          {settings}
        </DialogButton>
      </motion.div>
      <AnimatePresence propagate>
        {children && (
          <motion.div
            key="subheader"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
            className="relative -z-10 flex h-[6svh] w-screen justify-between px-2"
          >
            <div className="absolute inset-0 rounded-b-[40px] bg-secondary brightness-95" />
            <div className="relative flex w-full items-center justify-between">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
