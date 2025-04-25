import DialogButton from '@/components/generics/DialogButton';
import { ResetDialog } from '@/components/generics/Reset';
import { useSudokuState } from '@/sudoku/state';
import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';

const ResetButton: React.FC = () => {
  const { reset, restart } = useSudokuState();
  const [isResetOpen, setIsResetOpen] = useState(false);

  return (
    <DialogButton
      Icon={RotateCcw}
      title="Reset game?"
      isOpen={isResetOpen}
      setIsOpen={setIsResetOpen}
    >
      <ResetDialog reset={reset} restart={restart} />
    </DialogButton>
  );
};

export default ResetButton;
