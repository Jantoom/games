import { Flag } from 'lucide-react';
import React from 'react';
import { useMinesweeperState } from '@/minesweeper/state';
import ControlButton from '../../../components/generics/ControlButton';

const FlagButton: React.FC = () => {
  const { status, flagMode, setState } = useMinesweeperState();
  return (
    <ControlButton
      isSelected={flagMode}
      Icon={Flag}
      onClick={() => setState((prev) => ({ flagMode: !prev.flagMode }))}
      disabled={status !== 'play'}
    />
  );
};

export default FlagButton;
