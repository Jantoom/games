
import { Button } from "@/components/ui/button";

interface HintsModalProps {
  onClose: () => void;
  onGiveHint: () => void;
  onShowMismatches: () => void;
  onValidateGrid: () => void;
  onAddAutoNotes: () => void;
}

export const HintsModal: React.FC<HintsModalProps> = ({
  onClose,
  onGiveHint,
  onShowMismatches,
  onValidateGrid,
  onAddAutoNotes,
}) => (
  <>
    <div className="space-y-2">
      <Button onClick={onGiveHint} variant="outline" className="w-full hover:bg-secondary">
        Hint
      </Button>
      <Button onClick={onShowMismatches} variant="outline" className="w-full hover:bg-secondary">
        Show Mismatches
      </Button>
      <Button onClick={onValidateGrid} variant="outline" className="w-full hover:bg-secondary">
        Validate Grid
      </Button>
      <Button onClick={onAddAutoNotes} variant="outline" className="w-full hover:bg-secondary">
        Auto Notes
      </Button>
    </div>
    <Button onClick={onClose} variant="outline" className="w-full hover:bg-secondary">
      Close
    </Button>
  </>
);
