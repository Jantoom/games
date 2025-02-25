
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface NumberButtonProps {
  number: number | 'eraser';
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
      className={`
        w-[50px] h-[50px] p-0 relative rounded-full
        border-border text-foreground
        hover:bg-secondary
        ${isSelected ? 'bg-primary text-background' : 'bg-background'}
      `}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {number === 'eraser' ? (
          <Eraser className="h-6 w-6" />
        ) : (
          <>
            <span className="text-2xl font-medium">{number}</span>
            {remainingCount !== undefined && remainingCount > 0 && (
              <span className="text-xs absolute bottom-0">{remainingCount}</span>
            )}
          </>
        )}
      </div>
    </Button>
  );
};
