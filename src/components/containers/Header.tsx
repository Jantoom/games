import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';
import BackButton from '../elements/BackButton';
import SettingsButton from '../SettingsButton';

interface HeaderProps {
  settings?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ settings, className, children }) => {
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
        className="relative flex h-[6svh] w-full justify-center"
      >
        <div className="absolute inset-y-0 flex w-screen items-center justify-between px-2">
          <div
            className={`absolute inset-0 bg-primary brightness-95 transition-all duration-300 ease-in-out ${children ? 'rounded-b-[0px]' : 'rounded-b-[40px]'}`}
          />
          <BackButton cleanup={() => {}} />
          <div className="absolute left-1/2 h-full w-52 -translate-x-1/2 rounded-full bg-primary" />
          <SettingsButton>{settings}</SettingsButton>
        </div>
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
            className="relative -z-10 flex h-[6svh] w-full justify-center"
          >
            <div className="absolute inset-y-0 w-screen rounded-b-[40px] bg-secondary brightness-95" />
            <div
              className={cn(
                'relative flex w-full items-center justify-between px-2',
                className,
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
