import DialogButton from '@/components/generics/DialogButton';
import { ResetDialog } from '@/components/generics/Reset';
import { useSudokuStore } from '@/sudoku/state';
import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';

const ResetButton: React.FC = () => {
  const { reset, restart } = useSudokuStore();
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
