
import React, { useState, useEffect } from 'react';
import { CellNotes } from '@/lib/types';

interface SudokuCellProps {
  num: number;
  isOriginal: boolean;
  isHighlighted: boolean;
  isFlagged: boolean;
  notes: CellNotes | undefined;
  onClick: () => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  num,
  isOriginal,
  isHighlighted,
  isFlagged,
  notes,
  onClick,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [prevNum, setPrevNum] = useState<number>(null);
  const [currNum, setCurrNum] = useState<number>(null);
  const [activeCell, setActiveCell] = useState(false);
  const randomDelay = `${Math.random() * 0.1}s`;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCurrNum((prev) => {
      setPrevNum(prev ? prev : null);
      return num;
    });
    setActiveCell((prev) => !prev);
  }, [num]);

  return (
    <div 
    className={`w-14 h-14 flex p-1.5 ${!isOriginal ? 'cursor-pointer' : ''}`} 
    onClick={onClick}>
      <div 
      className={`relative flex w-full h-full items-center justify-center transition duration-300 ease-in-out ${isMounted ? 'scale-100' : 'scale-0'}`} 
      style={{transitionDelay: randomDelay}}>
        <div>
          {(isOriginal && <div 
          className={'absolute inset-0 rounded-full transition duration-300 ease-in-out bg-secondary'}
          />)}
          <div 
          className={`absolute inset-0 rounded-full transition duration-300 ease-in-out ${isHighlighted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} bg-primary`} 
          style={{transitionDelay: randomDelay}}
          />
          <div 
          className={`absolute inset-0 rounded-full transition duration-500 ease-in-out ${isFlagged ? 'bg-destructive' : ''}`}
          />
        </div>
        <span 
          key={'flip'} 
          className={`absolute text-xl font-medium select-none transition duration-300 ease-in-out ${ activeCell ? 'opacity-100' : 'opacity-0'} ${isHighlighted || isFlagged ? 'text-background' : isOriginal ? 'text-border' : 'text-primary'}`} 
          style={{transitionDelay: randomDelay}}
        >
          {activeCell ? currNum || '' : prevNum || ''}
        </span>
        <span 
          key={'flop'}
          className={`absolute text-xl font-medium select-none transition duration-300 ease-in-out ${ !activeCell ? 'opacity-100' : 'opacity-0'} ${isHighlighted || isFlagged ? 'text-background' : isOriginal ? 'text-border' : 'text-primary'}`} 
          style={{transitionDelay: randomDelay}}
        >
          {activeCell ? prevNum || '' : currNum || ''}
        </span>
        <div 
          className="absolute grid grid-cols-3 gap-x-1 gap-y-0.5 justify-items-center"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span 
              key={i} 
              className={`text-2xs font-medium leading-none select-none transition duration-300 ease-in-out ${notes?.has(i + 1) ? 'opacity-100' : 'opacity-0'} ${isHighlighted ? 'text-background' : 'text-primary'}`} 
              style={{transitionDelay: randomDelay}}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};