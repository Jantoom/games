import { Flag } from 'lucide-react';
import React from 'react';
import { useMinesweeperStore } from '@/minesweeper/state';
import ControlButton from '../../../components/generics/ControlButton';

const FlagButton: React.FC = () => {
  const { status, flagMode, setState } = useMinesweeperStore();
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
