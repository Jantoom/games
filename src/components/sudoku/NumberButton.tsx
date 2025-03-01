
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface NumberButtonProps {
  number: number;
  isSelected: boolean;
  remainingCount?: number;
  onClick: () => void;
}

export const NumberButton: React.FC<NumberButtonProps> = ({
  number,
  isSelected,
  remainingCount,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`w-14 h-14 relative rounded-full transition-colors duration-300 ease-in-out hover:bg-secondary ${isSelected ? 'bg-primary text-background' : ''}`}
    >
      {number ? (
        <>
          <span className="text-2xl font-medium">{number}</span>
          <span className="text-xs font-medium absolute pt-9">{remainingCount ? remainingCount : ''}</span>
        </>
      ) : (
        <Eraser className="h-6 w-6" />
      )}
    </Button>
  );
};
