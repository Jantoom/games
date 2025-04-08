import { useSudokuState } from '../sudokuState';
import SudokuCell from './SudokuCell';

const SudokuGrid: React.FC = () => {
  const {
    seed,
    isActive,
    originalGrid,
    grid,
    notes,
    errors,
    selectedNumber,
    isPencilMode,
    optHighlightSame,
    update,
  } = useSudokuState();

  return (
    <div
      key={seed}
      className="relative grid aspect-square w-full max-w-[50vh] grid-cols-9"
    >
      <svg className="pointer-events-none absolute" viewBox="0 0 1350 1350">
        <defs>
          <svg id="small">
            <line x1="25" y1="150" x2="125" y2="150" />
            <line x1="175" y1="150" x2="275" y2="150" />
            <line x1="325" y1="150" x2="425" y2="150" />
            <line x1="25" y1="300" x2="125" y2="300" />
            <line x1="175" y1="300" x2="275" y2="300" />
            <line x1="325" y1="300" x2="425" y2="300" />
            <line x1="150" y1="25" x2="150" y2="125" />
            <line x1="150" y1="175" x2="150" y2="275" />
            <line x1="150" y1="325" x2="150" y2="425" />
            <line x1="300" y1="25" x2="300" y2="125" />
            <line x1="300" y1="175" x2="300" y2="275" />
            <line x1="300" y1="325" x2="300" y2="425" />
          </svg>
        </defs>
        <g className="stroke-primary stroke-[6]">
          <line x1="450" y1="0" x2="450" y2="1350" />
          <line x1="900" y1="0" x2="900" y2="1350" />
          <line x1="0" y1="450" x2="1350" y2="450" />
          <line x1="0" y1="900" x2="1350" y2="900" />
        </g>
        <g className="stroke-secondary stroke-[1.5]">
          <use href="#small" transform="translate(0 0)" />
          <use href="#small" transform="translate(450 0)" />
          <use href="#small" transform="translate(900 0)" />
          <use href="#small" transform="translate(0 450)" />
          <use href="#small" transform="translate(450 450)" />
          <use href="#small" transform="translate(900 450)" />
          <use href="#small" transform="translate(0 900)" />
          <use href="#small" transform="translate(450 900)" />
          <use href="#small" transform="translate(900 900)" />
        </g>
      </svg>
      {grid.map((array, row) =>
        array.map((number_, col) => (
          <SudokuCell
            key={`${row}-${col}`}
            num={number_}
            isOriginal={originalGrid[row][col] !== 0}
            isHighlighted={
              optHighlightSame && selectedNumber !== -1 &&
              (number_ === selectedNumber ||
                notes[`${row}-${col}`].has(selectedNumber))
            }
            isFlagged={errors.includes(`${row}-${col}`)}
            notes={notes[`${row}-${col}`]}
            onClick={() =>
              isActive &&
              selectedNumber !== -1 &&
              !originalGrid[row][col] &&
              update(row, col, selectedNumber, isPencilMode)
            }
          />
        )),
      )}
    </div>
  );
};

export default SudokuGrid;
