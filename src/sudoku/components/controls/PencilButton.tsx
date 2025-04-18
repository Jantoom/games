import { Pencil } from 'lucide-react';
import React from 'react';
import { useSudokuState } from '@/sudoku/state';
import ControlButton from '../../../components/generics/ControlButton';

const PencilButton: React.FC = () => {
  const { status, pencilMode, setState } = useSudokuState();
  return (
    <ControlButton
      isSelected={pencilMode}
      Icon={Pencil}
      onClick={() =>
        setState((prev) => ({
          pencilMode: !prev.pencilMode,
        }))
      }
      disabled={status !== 'play'}
    />
  );
};

export default PencilButton;
