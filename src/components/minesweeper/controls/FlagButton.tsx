import { Flag } from 'lucide-react';
import React from 'react';
import { useMinesweeperState } from '@/states/minesweeperState';
import ControlButton from '../../ControlButton';

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
