import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import DialogButton from '@/components/generics/DialogButton';
import { ResetDialog } from '@/components/generics/Reset';
import { use2048Store } from '@/games/2048/state';

const ResetButton: React.FC = () => {
  const { reset, restart } = use2048Store();
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
