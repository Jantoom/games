
import React from 'react';
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
  const randomDelay = `${Math.random() * 0.2}s`;

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
      {cell !== 0 ? (
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
          <span className={`
            relative z-10 text-xl font-medium
            ${isOriginal ? 'text-primary' : 'text-game-gridline'}
          `}>
            {cell}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[2px] p-1 w-full h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[8px] text-game-pencil"
            >
              {notes?.has(i + 1) ? i + 1 : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
