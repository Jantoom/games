
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
    <Button onClick={onGiveHint} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
      Hint
    </Button>
    <Button onClick={onShowMismatches} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
      Show Mismatches
    </Button>
    <Button onClick={onValidateGrid} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
      Validate Grid
    </Button>
    <Button onClick={onAddAutoNotes} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
      Auto Notes
    </Button>
    <Button onClick={onClose} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
      Close
    </Button>
  </>
);
