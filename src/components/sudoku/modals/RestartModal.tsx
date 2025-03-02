
import { Button } from "@/components/ui/button";

interface RestartModalProps {
  isRestartOpen: boolean;
  onRestart: () => void;
  onClose: () => void;
}

export const RestartModal: React.FC<RestartModalProps> = ({ 
  isRestartOpen,
  onRestart,
  onClose, 
}) => (
  <div onClick={(e) => e.stopPropagation()} className={`absolute w-full border border-border bg-background p-6 rounded-lg space-y-4 transition-opacity duration-300 ease-in-out ${isRestartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className="flex flex-col gap-4">
      <p className="text-center">Are you sure you want to restart?</p>
      <Button onClick={() => { onRestart(); onClose(); }} variant="outline" className="w-full border border-border hover:bg-secondary">
        Yes
      </Button>
      <Button onClick={onClose} variant="outline" className="w-full border border-border hover:bg-secondary">
        No
      </Button>
    </div>
  </div>
);
