
import { Button } from "@/components/ui/button";

interface RestartModalProps {
  onClose: () => void;
  onRestart: () => void;
}

export const RestartModal: React.FC<RestartModalProps> = ({ onClose, onRestart }) => (
  <div className="flex flex-col gap-4">
    <p className="text-center text-color-2">Are you sure you want to restart?</p>
    <Button onClick={onRestart} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
      Yes
    </Button>
    <Button onClick={onClose} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
      No
    </Button>
  </div>
);
