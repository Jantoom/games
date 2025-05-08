import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GameStatus, PagePath } from '@/lib/types';
import LeaderboardButton from '../elements/LeaderboardButton';
import SettingsButton from '../elements/SettingsButton';

interface FooterProps {
  status?: GameStatus;
  reset?: React.ReactNode;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ status, reset, children }) => {
  const [variant, _setVariant] = useState(
    useLocation().pathname.split('/').pop() as PagePath | undefined,
  );

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
      className="relative flex h-[8svh] min-h-16 w-screen items-center justify-evenly p-1"
    >
      <div className="absolute inset-0 -z-10 bg-background opacity-95" />
      {variant === 'create' ? (
        <>
          <SettingsButton />
          <LeaderboardButton />
        </>
      ) : variant === 'play' ? (
        status === 'finished' ? (
          reset
        ) : (
          children
        )
      ) : (
        children
      )}
    </motion.div>
  );
};

export default Footer;
