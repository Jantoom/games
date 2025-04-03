import React from 'react';
import ControlButton from '../../ControlButton';
import { useMinesweeperState } from '@/states/minesweeperState';
import { Flag } from 'lucide-react';

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
