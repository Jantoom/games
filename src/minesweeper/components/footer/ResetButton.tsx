import DialogButton from '@/components/generics/DialogButton';
import { ResetDialog } from '@/components/generics/Reset';
import { useMinesweeperState } from '@/minesweeper/state';
import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';

const ResetButton: React.FC = () => {
  const { reset } = useMinesweeperState();
  const [isResetOpen, setIsResetOpen] = useState(false);

  return (
    <DialogButton
      Icon={RotateCcw}
      title="Reset game?"
      isOpen={isResetOpen}
      setIsOpen={setIsResetOpen}
    >
      <ResetDialog reset={reset} />
    </DialogButton>
  );
};

export default ResetButton;