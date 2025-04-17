import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { Settings } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BackButton from '../elements/BackButton';
import DialogButton from '../generics/DialogButton';

interface HeaderProps {
  back?: 'menu' | 'create' | 'play';
  settings?: React.ReactNode;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ back, settings, children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const hasVisibleChildren = React.Children.toArray(children).some(Boolean);

  return (
    <>
      <motion.div
        key="header"
        layout
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
        className={`relative flex h-[6svh] w-screen items-center justify-between px-[2.5vw]`}
      >
        <div
          className={`absolute inset-0 bg-primary brightness-95 transition-[border-radius] duration-500 ease-in-out ${hasVisibleChildren ? 'rounded-b-[0px]' : 'rounded-b-[40px]'}`}
        />
        <BackButton back={back} />
        <div className="absolute left-1/2 h-full w-52 -translate-x-1/2 rounded-full bg-primary" />
        {settings && (
          <DialogButton
            Icon={Settings}
            title="Settings"
            isOpen={isSettingsOpen}
            setIsOpen={setIsSettingsOpen}
            className="relative"
          >
            {settings}
          </DialogButton>
        )}
      </motion.div>
      <AnimatePresence mode="popLayout">
        {hasVisibleChildren && (
          <motion.div
            key={useLocation().pathname}
            layout
            initial={{ y: -100 }}
            animate={{ y: useIsPresent() ? 0 : -100 }}
            exit={{ y: -100 }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
            className="relative -z-10 flex h-[6svh] w-screen justify-between px-[2.5vw]"
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
