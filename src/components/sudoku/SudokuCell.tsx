
import React, { useState, useEffect } from 'react';
import { PencilButtonHandles } from './controls/pencil/PencilButton';

interface SudokuCellProps {
  row: number;
  col: number;
  number: number;
  isOriginal: boolean;
  isHighlighted: boolean;
  PencilFeatureRef: React.RefObject<PencilButtonHandles>;
  onClick: () => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  row,
  col,
  number,
  isOriginal,
  isHighlighted,
  PencilFeatureRef,
  onClick,
}) => {
  const [prevHighlighted, setPrevHighlighted] = useState(isHighlighted);
  const [showDeselect, setShowDeselect] = useState(false);
  const randomDelay = `${Math.random() * 0.2}s`;

  useEffect(() => {
    if (prevHighlighted && !isHighlighted) {
      setShowDeselect(true);
      setTimeout(() => setShowDeselect(false), 200);
    }
    setPrevHighlighted(isHighlighted);
  }, [isHighlighted, prevHighlighted]);

  const insetBorders = `
    ${row === 0 ? '' : 'border-t-[1px] mt-[2px]'}
    ${col === 0 ? '' : 'border-l-[1px] ml-[2px]'}
    ${row === 8 ? '' : 'border-b-[1px] mb-[2px]'}
    ${col === 8 ? '' : 'border-r-[1px] mr-[2px]'}
  `;

  const blockBorder = `
    ${row % 3 === 0 ? 'border-t-[1px]' : ''}
    ${col % 3 === 0 ? 'border-l-[1px]' : ''}
    ${row % 3 === 2 ? 'border-b-[1px]' : ''}
    ${col % 3 === 2 ? 'border-r-[1px]' : ''}
  `;

  return (
    <div
      data-pos={`${row}-${col}`}
      className={`
        w-[45px] h-[45px] flex items-center justify-center
        bg-white
        hover:bg-game-highlight
        cursor-pointer transition-colors duration-200
        ${blockBorder}
        ${insetBorders}
        border-game-gridline
        relative
      `}
      onClick={onClick}
    >
      {number > 0 ? (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className={`
            absolute inset-0 rounded-full
            ${isOriginal ? 'bg-neutral-100' : ''}
          `} />
          {isHighlighted && (
            <div 
              className="absolute inset-0 rounded-full bg-blue-100 animate-scale-fade"
              style={{ animationDelay: randomDelay }}
            />
          )}
          {showDeselect && (
            <div 
              className="absolute inset-0 rounded-full bg-blue-100 animate-scale-out"
              style={{ animationDelay: randomDelay }}
            />
          )}
          <div 
            data-error={`${row}-${col}`}
            className="absolute inset-0 rounded-full bg-red-200 opacity-0 hidden"
          />
          <span className={`
            relative z-10 text-xl font-medium
            ${isOriginal ? 'text-primary' : 'text-game-gridline'}
          `}>
            {number}
          </span>
        </div>
      ) : PencilFeatureRef.current.displayCellNotes(row, col) }
    </div>
  );
};
