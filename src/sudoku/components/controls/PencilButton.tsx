import { Pencil } from 'lucide-react';
import React from 'react';
import ControlButton from '@/components/ControlButton';
import { useSudokuState } from '@/sudoku/state';

const PencilButton: React.FC = () => {
  const { isActive, isPencilMode, setState } = useSudokuState();
  return (
    <ControlButton
      isSelected={isPencilMode}
      Icon={Pencil}
      onClick={() =>
        setState((prevState) => ({
          isPencilMode: !prevState.isPencilMode,
        }))
      }
      disabled={!isActive}
    />
  );
};

export default PencilButton;
