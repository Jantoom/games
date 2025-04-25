import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import React, { useState } from 'react';
import BackButton from '../elements/BackButton';
import DialogButton from '../generics/DialogButton';
import { Label } from '../ui/label';

interface HeaderProps {
  title?: string;
  back?: 'menu' | 'create' | 'play';
  settings?: React.ReactNode;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, back, settings, children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const hasVisibleChildren = React.Children.toArray(children).some(Boolean);

  return (
    <motion.div
      key="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className={`relative flex h-[8svh] w-screen items-center justify-center p-1`}
    >
      <div className="absolute inset-0 -z-10 brightness-95" />
      {back && (
        <BackButton
          back={back}
          className="absolute left-1 aspect-square h-fit"
        />
      )}
      {hasVisibleChildren ? (
        <div className="flex w-1/4 min-w-32 items-center justify-between gap-x-6">
          {children}
        </div>
      ) : (
        <div>
        <Label className="text-center text-2xl">{title}</Label>
        </div>
      )}
      {settings && (
        <DialogButton
          Icon={Settings}
          title="Settings"
          isOpen={isSettingsOpen}
          setIsOpen={setIsSettingsOpen}
          className="absolute right-1 aspect-square h-fit"
        >
          {settings}
        </DialogButton>
      )}
    </motion.div>
  );
};

export default Header;
