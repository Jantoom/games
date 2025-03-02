
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
  <div onClick={(e) => e.stopPropagation()} className={`absolute w-full border border-border bg-background p-6 rounded-lg space-y-4 transition-opacity duration-300 ease-in-out ${isHintsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className='space-y-2'>
      <Button onClick={() => { onGiveHint(); onClose(); }} variant="outline" className="w-full border border-border hover:bg-secondary">
        Hint
      </Button>
      <Button onClick={() => { onShowMismatches(); onClose(); }} variant="outline" className="w-full border border-border hover:bg-secondary">
        Show Mismatches
      </Button>
      <Button onClick={() => { onValidateGrid(); onClose(); }} variant="outline" className="w-full border border-border hover:bg-secondary">
        Validate Grid
      </Button>
      <Button onClick={() => { onAddAutoNotes(); onClose(); }} variant="outline" className="w-full border border-border hover:bg-secondary">
        Auto Notes
      </Button>
    </div>
    <Button onClick={onClose} variant="outline" className="w-full border border-border hover:bg-secondary">
      Close
    </Button>
  </div>
);
