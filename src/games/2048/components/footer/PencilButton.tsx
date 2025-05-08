import { Pencil } from 'lucide-react';
import React from 'react';
import ControlButton from '@/components/generics/ControlButton';
import { use2048Store } from '@/games/2048/state';

const PencilButton: React.FC = () => {
  const { status, pencilMode, setState } = use2048Store();
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
