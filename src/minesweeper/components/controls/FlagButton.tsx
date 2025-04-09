import { Flag } from 'lucide-react';
import React from 'react';
import ControlButton from '@/components/ControlButton';
import { useMinesweeperState } from '@/minesweeper/state';

const FlagButton: React.FC = () => {
  const { isActive, isFlagMode, setState } = useMinesweeperState();
  return (
    <ControlButton
      isSelected={isFlagMode}
      Icon={Flag}
      onClick={() =>
        setState((prevState) => ({ isFlagMode: !prevState.isFlagMode }))
      }
      disabled={!isActive}
    />
  );
};

export default FlagButton;
