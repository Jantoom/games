
import React from 'react';
import { Notes } from '../types';
import { RestartButton, RestartButtonHandles } from './restart/RestartButton';
import { HintsButton, HintsButtonHandles } from './hints/HintsButton';
import { PencilButton, PencilButtonHandles } from './pencil/PencilButton';
import { UndoButton, UndoButtonHandles } from './undo/UndoButton';

interface ControlButtonsProps {
  originalGrid: number[][];
  grid: number[][];
  notes: Notes;
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>;
  setNotes: React.Dispatch<React.SetStateAction<Notes>>;
  callUpdate: () => void;
  callRestart: () => void;
  RestartFeatureRef: React.RefObject<RestartButtonHandles>;
  HintsFeatureRef: React.RefObject<HintsButtonHandles>;
  PencilFeatureRef: React.RefObject<PencilButtonHandles>;
  UndoFeatureRef: React.RefObject<UndoButtonHandles>;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  originalGrid,
  grid,
  notes,
  setGrid,
  setNotes,
  callUpdate,
  callRestart,
  RestartFeatureRef,
  HintsFeatureRef,
  PencilFeatureRef,
  UndoFeatureRef
}) => {
  return (
    <div className="flex justify-center gap-4 w-full">
      <RestartButton ref={RestartFeatureRef} callRestart={callRestart} />
      <HintsButton ref={HintsFeatureRef} originalGrid={originalGrid} grid={grid} notes={notes} setGrid={setGrid} setNotes={setNotes} callUpdate={callUpdate} />
      <PencilButton ref={PencilFeatureRef} />
      <UndoButton ref={UndoFeatureRef} setGrid={setGrid} setNotes={setNotes}/>
    </div>
  );
};
