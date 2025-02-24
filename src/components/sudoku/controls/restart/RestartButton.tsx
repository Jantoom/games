import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { RestartModal } from './RestartModal';

export interface RestartButtonHandles {
    clearRestart: () => void;
};

interface RestartButtonProps {
    callRestart: () => void;
}

export const RestartButton = forwardRef<RestartButtonHandles, RestartButtonProps>(({callRestart}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({
            clearRestart: () => setIsModalOpen(false)
          }));

  return (
    <>
    
      <Button
        variant="ghost"
        onClick={() => setIsModalOpen(true)}
        className="w-[45px] h-[45px] p-0 rounded-full"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 12a9 9 0 1 1 9 9M3 12h9" />
        </svg>
      </Button>

        <RestartModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} callRestart={callRestart}/>
      </>
  );
});
