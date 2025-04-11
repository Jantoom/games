import { Pencil } from 'lucide-react';
import React from 'react';
import ControlButton from '../../../components/generics/ControlButton';
import { useSudokuState } from '@/sudoku/state';

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
