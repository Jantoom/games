import { Undo } from 'lucide-react';
import React from 'react';
import ControlButton from '@/components/generics/ControlButton';
import { useSudokuStore } from '@/games/sudoku/state';

const UndoButton: React.FC = () => {
  const { status, history, undo } = useSudokuStore();

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
