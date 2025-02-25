
import React, { useState, useEffect } from 'react';
import { CellNotes } from './types';

interface SudokuCellProps {
  rowIndex: number;
  colIndex: number;
  cell: number;
  isOriginal: boolean;
  isHighlighted: boolean;
  notes: CellNotes | undefined;
  onClick: () => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  rowIndex,
  colIndex,
  cell,
  isOriginal,
  isHighlighted,
  notes,
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
    ${rowIndex === 0 ? '' : 'border-t-[1px] mt-[2px]'}
    ${colIndex === 0 ? '' : 'border-l-[1px] ml-[2px]'}
    ${rowIndex === 8 ? '' : 'border-b-[1px] mb-[2px]'}
    ${colIndex === 8 ? '' : 'border-r-[1px] mr-[2px]'}
  `;

  const blockBorder = `
    ${rowIndex % 3 === 0 ? 'border-t-[1px]' : ''}
    ${colIndex % 3 === 0 ? 'border-l-[1px]' : ''}
    ${rowIndex % 3 === 2 ? 'border-b-[1px]' : ''}
    ${colIndex % 3 === 2 ? 'border-r-[1px]' : ''}
  `;

  return (
    <div
      data-pos={`${rowIndex}-${colIndex}`}
      className={`
        w-[45px] h-[45px] flex items-center justify-center
        bg-color-1
        hover:bg-color-4
        cursor-pointer transition-colors duration-200
        ${blockBorder}
        ${insetBorders}
        border-color-4
        relative
      `}
      onClick={onClick}
    >
      {cell !== 0 ? (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className={`
            absolute inset-0 rounded-full
            ${isOriginal ? 'bg-color-4' : ''}
          `} />
          {isHighlighted && (
            <div 
              className="absolute inset-0 rounded-full bg-color-5 animate-scale-fade"
              style={{ animationDelay: randomDelay }}
            />
          )}
          {showDeselect && (
            <div 
              className="absolute inset-0 rounded-full bg-color-5 animate-scale-out"
              style={{ animationDelay: randomDelay }}
            />
          )}
          <div 
            data-error={`${rowIndex}-${colIndex}`}
            className="absolute inset-0 rounded-full bg-color-6 opacity-0 hidden"
          />
          <span className={`
            relative z-10 text-xl font-medium
            ${isOriginal ? 'text-color-3' : 'text-color-5'}
            ${isHighlighted ? 'text-color-1' : ''}
          `}>
            {cell}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[2px] p-1 w-full h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[8px] text-color-5"
            >
              {notes?.has(i + 1) ? i + 1 : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
