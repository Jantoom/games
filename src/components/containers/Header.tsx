import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import React, { useState } from 'react';
import BackButton from '../elements/BackButton';
import DialogButton from '../generics/DialogButton';

interface HeaderProps {
  back?: 'menu' | 'create' | 'play';
  settings?: React.ReactNode;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ back, settings, children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        <div className="absolute inset-0 rounded-b-[40px] bg-secondary brightness-95 transition-[border-radius] duration-500 ease-in-out" />
        <BackButton back={back} />
        {children}
        <div className="relative flex w-full h-full items-center justify-end">
          {settings && (
            <DialogButton
              Icon={Settings}
              title="Settings"
              isOpen={isSettingsOpen}
              setIsOpen={setIsSettingsOpen}
            >
              {settings}
            </DialogButton>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Header;
