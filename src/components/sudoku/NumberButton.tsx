
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
      className={`w-full min-h-[w-full] h-full aspect-square relative rounded-full transition-colors duration-300 ease-in-out hover:bg-secondary ${isSelected ? 'bg-primary text-background' : ''}`}
    >
      {number ? (
        <>
          <span className="text-[min(5vw,2.5vh)] font-medium">{number}</span>
          <span className="text-[min(2.5vw,1.25vh)] font-medium absolute pt-[65%]">{remainingCount ? remainingCount : ''}</span>
        </>
      ) : (
        <Eraser className="h-full w-full" />
      )}
    </Button>
  );
};
