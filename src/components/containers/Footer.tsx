import { GameStatus, PagePath } from '@/lib/types';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import SettingsButton from '../elements/SettingsButton';
import LeaderboardButton from '../elements/LeaderboardButton';
import { useLocation } from 'react-router-dom';

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
      className="relative flex h-[8svh] w-screen items-center justify-evenly p-1"
    >
      <div className="absolute inset-0 -z-10 bg-background opacity-95" />
      {variant === 'create' ? (
        <>
          <SettingsButton />
          <LeaderboardButton />
        </>
      ) : variant === 'play' ? (
        status !== 'finished' ? (
          children
        ) : (
          reset
        )
      ) : (
        children
      )}
    </motion.div>
  );
};

export default Footer;
