import { Undo } from 'lucide-react';
import React from 'react';
import { useSudokuState } from '@/states/sudokuState';
import ControlButton from '../../ControlButton';

interface UndoButtonProps {
  undo: () => void;
}

const UndoButton: React.FC<UndoButtonProps> = ({ undo }) => {
  const { isActive, history } = useSudokuState();

  return (
    <ControlButton
      isSelected={false}
      Icon={Undo}
      onClick={undo}
      disabled={history.length === 0 || !isActive}
      className="aspect-square h-auto w-[10%] rounded-full active:bg-primary active:text-background"
    />
  );
};

export default UndoButton;
