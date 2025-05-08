import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import DialogButton from '@/components/generics/DialogButton';
import { ResetDialog } from '@/components/generics/Reset';
import { useMinesweeperStore } from '@/games/minesweeper/state';

const ResetButton: React.FC = () => {
  const { reset } = useMinesweeperStore();
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