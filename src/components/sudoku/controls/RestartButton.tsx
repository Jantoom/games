
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ControlButton } from "./ControlButton";
import { useState } from "react";
import { RotateCcw } from "lucide-react";

interface RestartButtonProps {
  restart: () => void;
}

export const RestartButton: React.FC<RestartButtonProps> = ({ 
  restart
}) => {
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  
  const onClose = () => setIsRestartOpen(false);
  const onRestart = () => {
    restart();
    onClose();
  };

  return (<Dialog>
    <DialogTrigger asChild>
      <ControlButton isSelected={isRestartOpen} Icon={RotateCcw} onClick={() => setIsRestartOpen(true)} />
    </DialogTrigger>
    <DialogContent className="border-border [&>button:last-child]:hidden">
      <DialogHeader>
        <DialogTitle className="text-center">Are you sure you want to restart?</DialogTitle>
      </DialogHeader>
      <DialogClose asChild>
        <Button onClick={onRestart} variant="outline" className="w-full border border-border hover:bg-secondary">
          Yes
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button onClick={onClose} variant="outline" className="w-full border border-border hover:bg-secondary">
          No
        </Button>
      </DialogClose>
    </DialogContent>
  </Dialog>);
}
