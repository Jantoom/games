
import { Button } from "@/components/ui/button";

interface RestartModalProps {
  onClose: () => void;
  onRestart: () => void;
}

export const RestartModal: React.FC<RestartModalProps> = ({ onClose, onRestart }) => (
  <div className="flex flex-col gap-4">
    <p className="text-center text-foreground">Are you sure you want to restart?</p>
    <Button onClick={onRestart} variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
      Yes
    </Button>
    <Button onClick={onClose} variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
      No
    </Button>
  </div>
);
