
import { Button } from "@/components/ui/button";

interface HintsModalProps {
  isHintsOpen: boolean;
  onGiveHint: () => void;
  onShowMismatches: () => void;
  onValidateGrid: () => void;
  onAddAutoNotes: () => void;
  onClose: () => void;
}

export const HintsModal: React.FC<HintsModalProps> = ({
  isHintsOpen,
  onClose,
  onGiveHint,
  onShowMismatches,
  onValidateGrid,
  onAddAutoNotes,
}) => (
  <div className={`absolute w-full bg-background p-6 rounded-lg space-y-4 transition-opacity duration-300 ease-in-out ${isHintsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className='space-y-2'>
      <Button onClick={() => { onGiveHint(); onClose(); }} variant="outline" className="w-full hover:bg-secondary">
        Hint
      </Button>
      <Button onClick={() => { onShowMismatches(); onClose(); }} variant="outline" className="w-full hover:bg-secondary">
        Show Mismatches
      </Button>
      <Button onClick={() => { onValidateGrid(); onClose(); }} variant="outline" className="w-full hover:bg-secondary">
        Validate Grid
      </Button>
      <Button onClick={() => { onAddAutoNotes(); onClose(); }} variant="outline" className="w-full hover:bg-secondary">
        Auto Notes
      </Button>
    </div>
    <Button onClick={onClose} variant="outline" className="w-full hover:bg-secondary">
      Close
    </Button>
  </div>
);
