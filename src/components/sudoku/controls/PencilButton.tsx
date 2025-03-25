import React from 'react';
import ControlButton from '../../ControlButton';
import { useSudokuState } from '@/states/sudokuState';
import { Pencil } from 'lucide-react';

const PencilButton: React.FC = () => {
  const { isActive, isPencilMode, setState } = useSudokuState();
  return (
    <ControlButton
      isSelected={isPencilMode}
      Icon={Pencil}
      onClick={() =>
        setState((prevState) => ({ isPencilMode: !prevState.isPencilMode }))
      }
      disabled={!isActive}
    />
  );
};

export default PencilButton;
