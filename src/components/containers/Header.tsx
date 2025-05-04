import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import React, { useState } from 'react';
import BackButton from '../elements/BackButton';
import DialogButton from '../generics/DialogButton';
import { Label } from '../ui/label';
import ThemeButton from '../elements/ThemeButton';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  settings?: React.ReactNode;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ settings, children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const hasVisibleChildren = React.Children.toArray(children).some(Boolean);

  const [title, _setTitle] = useState(
    useLocation().pathname.split('/').filter(chunk => chunk !== '')[1] ?? 'Games by Jaleel',
  );

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
      className={`relative flex h-[8svh] min-h-16 w-screen items-center justify-center p-1`}
    >
      <div className="absolute inset-0 -z-10 bg-background opacity-95" />
      <div className="absolute inset-0 flex flex-row-reverse items-center justify-between p-1">
        <ThemeButton />
        {title !== 'Games by Jaleel' && <BackButton />}
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
      {hasVisibleChildren ? (
        <div className="flex w-3/4 min-w-32 items-center gap-x-6">
          {children}
        </div>
      ) : (
        <div>
          <Label className="text-center text-2xl capitalize">{title}</Label>
        </div>
      )}
    </motion.div>
  );
};

export default Header;
