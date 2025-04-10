import { Undo } from 'lucide-react';
import React from 'react';
import ControlButton from '../../../components/generics/ControlButton';
import { useSudokuState } from '@/sudoku/state';

const UndoButton: React.FC = () => {
  const { isActive, history, undo } = useSudokuState();

  return (
    <ControlButton
      isSelected={false}
      Icon={Undo}
      onClick={undo}
      disabled={history.length === 0 || !isActive}
    />
  );
};

export default UndoButton;
