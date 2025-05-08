import { Eraser } from 'lucide-react';
import React, { useEffect } from 'react';
import ScaledContainer from '@/components/containers/ScaledContainer';
import { Button } from '@/components/ui/button';
import { use2048Store } from '@/games/2048/state';
import { getMatchingCells } from '@/games/2048/utils';

const NumberButtons: React.FC = () => {
  const { status, grid, selectedNumber, optAssistRemaining, setState } =
    use2048Store();

  useEffect(() => {
    if (optAssistRemaining) setState({ usedAssistRemaining: true });
  }, [optAssistRemaining, setState]);

  return (
    <ScaledContainer
      className="h-[18svh] w-full"
      style={{ height: 150, width: 400 }}
    >
      <div className="grid max-w-full grid-cols-5 grid-rows-2 justify-items-center gap-2 px-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const isSelected = selectedNumber === num;
          const remainingCount = Math.max(
            9 - getMatchingCells(grid, num).length,
            0,
          );
          return (
            <Button
              key={num}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() =>
                setState((prev) => ({
                  selectedNumber:
                    status === 'play' && prev.selectedNumber !== num
                      ? num
                      : undefined,
                }))
              }
              className="relative aspect-square h-full py-0"
            >
              {num ? (
                <>
                  <span className="text-3xl font-medium leading-none">
                    {num}
                  </span>
                  <span className="absolute pt-11 text-base font-medium">
                    {(optAssistRemaining && remainingCount) || ''}
                  </span>
                </>
              ) : (
                <Eraser className="h-2/5" />
              )}
            </Button>
          );
        })}
      </div>
    </ScaledContainer>
  );
};

export default NumberButtons;
