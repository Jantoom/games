import React from 'react';
import { Button } from "@/components/ui/button";

interface HintsModalProps {
  isModalOpen: boolean;
  giveHint: () => void;
  showMismatches: () => void;
  validateGrid: () => void;
  addAutoNotes: () => void;
  onClose: () => void; 
}
export const HintsModal: React.FC<HintsModalProps> = ({
  isModalOpen,
  giveHint,
  showMismatches,
  validateGrid,
  addAutoNotes,
  onClose
}) => {
  return <>{(isModalOpen) && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <Button onClick={giveHint} variant="outline" className="w-full">
            Hint
          </Button>
          <Button onClick={showMismatches} variant="outline" className="w-full">
            Show Mismatches
          </Button>
          <Button onClick={validateGrid} variant="outline" className="w-full">
            Validate Grid
          </Button>
          <Button onClick={addAutoNotes} variant="outline" className="w-full">
            Auto Notes
          </Button>
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
    </div>
  </div>}
  </>;
};