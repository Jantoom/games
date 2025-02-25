
import React, { useState, useEffect } from 'react';
import { CellNotes } from './types';

interface SudokuCellProps {
  rowIndex: number;
  colIndex: number;
  cell: number;
  isOriginal: boolean;
  isHighlighted: boolean;
  isFlagged: boolean;
  notes: CellNotes | undefined;
  onClick: () => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  rowIndex,
  colIndex,
  cell,
  isOriginal,
  isHighlighted,
  isFlagged,
  notes,
  onClick,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const randomDelay = `${Math.random() * 0.1}s`;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
      className={`flex items-center justify-center p-1.5 bg-background relative ${!isOriginal ? 'cursor-pointer' : ''}`}
      onClick={onClick}>
        <div 
          className={`relative w-11 h-11 flex items-center justify-center transition duration-300 ease-in-out ${isMounted ? 'scale-100' : 'scale-0'}`} 
          style={{transitionDelay: randomDelay}}>
        <div className={`absolute inset-0 rounded-full ${isOriginal ? 'bg-secondary' : ''}`} />
        <div 
          className={`absolute inset-0 rounded-full transition duration-300 ease-in-out ${isHighlighted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} bg-primary`} 
          style={{transitionDelay: randomDelay}}/>
        <div className={`absolute inset-0 rounded-full transition duration-700 ease-in-out ${isFlagged ? 'bg-destructive' : ''}`} />
        {cell !== 0 ? 
          <span 
            className={`absolute z-10 text-xl font-medium select-none transition duration-300 ease-in-out ${isHighlighted || isFlagged ? 'text-background' : isOriginal ? 'text-border' : 'text-primary'}`} 
            style={{transitionDelay: randomDelay}}>
            {cell}
          </span> :
          <div className="absolute grid grid-cols-3 p-2 w-full">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={`flex items-center justify-center text-[10px] select-none transition duration-300 ease-in-out ${notes?.has(i + 1) ? 'opacity-100' : 'opacity-0'} ${isHighlighted ? 'text-background' : 'text-primary'}`} 
                style={{transitionDelay: randomDelay}}>
                {i + 1}
              </span>
            ))}
          </div>}
        </div>
      </div>
      { rowIndex % 3 !== 0 ? <div className="absolute top-0 left-2 right-2 h-[1px] bg-secondary transform -translate-y-[0.5px]"/> :
        rowIndex === 3 || rowIndex === 6 ? <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary transform -translate-y-[1px]"/> : <></> }
      { colIndex % 3 !== 0 ? <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-secondary transform -translate-x-[0.5px]"/> :
        colIndex === 3 || colIndex === 6 ? <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary transform -translate-x-[1px]"/> : <></> }
    </div>
  );
};
