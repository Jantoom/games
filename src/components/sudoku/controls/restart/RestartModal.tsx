import React from 'react';
import { Button } from "@/components/ui/button";

interface RestartModalProps {
  isModalOpen: boolean;
  onClose: () => void; 
  callRestart: () => void;
}
export const RestartModal: React.FC<RestartModalProps> = ({
  isModalOpen,
  onClose,
  callRestart,
}) => {
  return <>{(isModalOpen) && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <p className="text-center">Are you sure you want to restart?</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={callRestart} variant="outline">
                    Yes
                  </Button>
                  <Button onClick={onClose} variant="outline">
                    No
                  </Button>
                </div>
    </div>
  </div>}
  </>;
};