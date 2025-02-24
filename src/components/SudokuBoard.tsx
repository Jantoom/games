import { useState, useEffect, useRef } from "react";
import { generateSudoku, getRemainingCount } from "@/lib/sudoku";
import { SudokuCell } from "./sudoku/SudokuCell";
import { NumberButton } from "./sudoku/NumberButton";
import { Difficulty } from "./sudoku/types";
import { PencilButton, PencilButtonHandles } from "./sudoku/controls/pencil/PencilButton";
import { UndoButton, UndoButtonHandles } from "./sudoku/controls/undo/UndoButton";
import { RestartButton, RestartButtonHandles } from "./sudoku/controls/restart/RestartButton";
import { HintsButton, HintsButtonHandles } from "./sudoku/controls/hints/HintsButton";
import { TimerText, TimerTextHandles } from "./sudoku/timer/TimerText";
import { DifficultyButtons, DifficultyButtonsHandles } from "./sudoku/difficulty/DifficultyButtons";

export const SudokuBoard = () => {
  const [originalGrid, setOriginalGrid] = useState<number[][]>([]);
  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const DifficultyFeatureRef = useRef<DifficultyButtonsHandles>(null);
  const TimerFeatureRef = useRef<TimerTextHandles>(null);
  const RestartFeatureRef = useRef<RestartButtonHandles>(null);
  const HintsFeatureRef = useRef<HintsButtonHandles>(null);
  const PencilFeatureRef = useRef<PencilButtonHandles>(null);
  const UndoFeatureRef = useRef<UndoButtonHandles>(null);
  
  useEffect(() => {
    const newGrid = generateSudoku('easy');
    setOriginalGrid(newGrid.map(row => [...row]));
    setGrid(newGrid.map(row => [...row]));
    setSelectedNumber(null);
  }, []);

  const callUpdate = (row: number, col: number, number: number) => {
    UndoFeatureRef.current.addHistory(grid, PencilFeatureRef.current.getNotes());
    PencilFeatureRef.current.updateNotes(grid, setGrid, row, col, number);
  };
  
  const callRestart = () => {
    RestartFeatureRef.current.clearRestart();
    HintsFeatureRef.current.clearHints();
    PencilFeatureRef.current.clearPencil();
    UndoFeatureRef.current.clearHistory();

    setGrid(originalGrid.map(row => [...row]));
    setSelectedNumber(null);
  };

  const callReset = (newDifficulty: Difficulty) => {
    DifficultyFeatureRef.current.setDifficulty(newDifficulty);
    TimerFeatureRef.current.clearTimer();
    
    const newGrid = generateSudoku(newDifficulty);
    setOriginalGrid(newGrid.map(row => [...row]));
    callRestart();
  };

  const handleCellClick = (row: number, col: number) => {
    if (selectedNumber !== null && originalGrid[row][col] === 0) callUpdate(row, col, selectedNumber);
  };

  return <div className="flex flex-col items-center gap-8 p-4 bg-slate-100">
      <div className="flex justify-between items-center w-[424px]">
        <TimerText ref={TimerFeatureRef} />
        <DifficultyButtons ref={DifficultyFeatureRef} callReset={callReset} />
      </div>

      <div className="grid grid-cols-9 bg-game-gridline gap-[1px] p-[1px] rounded-lg shadow-lg overflow-hidden w-[424px] py-px">
        {grid.map((array, row) => array.map((number, col) => <SudokuCell key={`${row}-${col}`} row={row} col={col} number={number} isOriginal={originalGrid[row][col] !== 0} isHighlighted={selectedNumber !== null && number === selectedNumber} PencilFeatureRef={PencilFeatureRef} onClick={() => handleCellClick(row, col)} />))}
      </div>

      <div className="grid grid-rows-2 grid-cols-5 gap-3 w-[280px]">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => <NumberButton key={number} number={number} isSelected={selectedNumber === number} remainingCount={getRemainingCount(grid, number)} onClick={() => setSelectedNumber(prev => prev === number ? null : number)} />)}
      </div>

      <div className="flex justify-center gap-4 w-full">
            <RestartButton ref={RestartFeatureRef} callRestart={callRestart} />
            <HintsButton ref={HintsFeatureRef} originalGrid={originalGrid} grid={grid} notes={PencilFeatureRef.current?.getNotes()} setIsPencilMode={PencilFeatureRef.current?.setIsPencilMode} setNotes={PencilFeatureRef.current?.setNotes} callUpdate={callUpdate} />
            <PencilButton ref={PencilFeatureRef} />
            <UndoButton ref={UndoFeatureRef} setGrid={setGrid} setNotes={PencilFeatureRef.current?.setNotes}/>
          </div>
    </div>;
};