import { Undo } from 'lucide-react';
import React from 'react';
import { useSudokuState } from '@/sudoku/state';
import ControlButton from '../../../components/generics/ControlButton';

const UndoButton: React.FC = () => {
  const { status, history, undo } = useSudokuState();

  return (
    <ControlButton
      isSelected={false}
      Icon={Undo}
      onClick={undo}
      disabled={history.length === 0 || status !== 'play'}
    />
  );
};

export default UndoButton;
