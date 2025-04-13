import { animated, useSpring } from '@react-spring/web';
import { useCallback, useEffect, useRef } from 'react';
import Cell from '@/sudoku/components/game/Cell';
import { useSudokuState } from '../../state';

const Grid: React.FC = () => {
  const {
    seed,
    status,
    originalGrid,
    grid,
    notes,
    errors,
    selectedNumber,
    pencilMode,
    optAssistHighlight,
    update,
  } = useSudokuState();

  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const factor = 60;
  const [{ scale }, scaleApi] = useSpring(() => ({
    scale: 1,
  }));

  const updateScale = useCallback(() => {
    if (!gridRef.current || !gridContainerRef.current) return;
    const scale = Math.min(
      gridContainerRef.current.clientHeight / gridRef.current.clientHeight,
      gridContainerRef.current.clientWidth / gridRef.current.clientWidth,
    );
    void scaleApi.start({
      scale,
    });
  }, [grid, scaleApi]);

  window.addEventListener('resize', () => updateScale());

  useEffect(() => updateScale(), [updateScale]);

  return (
    <div
      ref={gridContainerRef}
      className="relative flex aspect-square w-full max-w-[60svh] items-center justify-center"
    >
      <animated.div
        ref={gridRef}
        key={seed}
        className="absolute grid grid-cols-9 grid-rows-9"
        style={{ height: factor * 9, width: factor * 9, scale }}
      >
        <svg
          className="pointer-events-none absolute"
          viewBox={`0 0 ${factor * 9} ${factor * 9}`}
        >
          <defs>
            <svg id="small">
              <line
                x1={`${factor / 6}`}
                y1={`${factor}`}
                x2={`${(factor / 6) * 5}`}
                y2={`${factor}`}
              />
              <line
                x1={`${(factor / 6) * 7}`}
                y1={`${factor}`}
                x2={`${(factor / 6) * 11}`}
                y2={`${factor}`}
              />
              <line
                x1={`${(factor / 6) * 13}`}
                y1={`${factor}`}
                x2={`${(factor / 6) * 17}`}
                y2={`${factor}`}
              />
              <line
                x1={`${factor / 6}`}
                y1={`${factor * 2}`}
                x2={`${(factor / 6) * 5}`}
                y2={`${factor * 2}`}
              />
              <line
                x1={`${(factor / 6) * 7}`}
                y1={`${factor * 2}`}
                x2={`${(factor / 6) * 11}`}
                y2={`${factor * 2}`}
              />
              <line
                x1={`${(factor / 6) * 13}`}
                y1={`${factor * 2}`}
                x2={`${(factor / 6) * 17}`}
                y2={`${factor * 2}`}
              />
              <line
                x1={`${factor}`}
                y1={`${factor / 6}`}
                x2={`${factor}`}
                y2={`${(factor / 6) * 5}`}
              />
              <line
                x1={`${factor}`}
                y1={`${(factor / 6) * 7}`}
                x2={`${factor}`}
                y2={`${(factor / 6) * 11}`}
              />
              <line
                x1={`${factor}`}
                y1={`${(factor / 6) * 13}`}
                x2={`${factor}`}
                y2={`${(factor / 6) * 17}`}
              />
              <line
                x1={`${factor * 2}`}
                y1={`${factor / 6}`}
                x2={`${factor * 2}`}
                y2={`${(factor / 6) * 5}`}
              />
              <line
                x1={`${factor * 2}`}
                y1={`${(factor / 6) * 7}`}
                x2={`${factor * 2}`}
                y2={`${(factor / 6) * 11}`}
              />
              <line
                x1={`${factor * 2}`}
                y1={`${(factor / 6) * 13}`}
                x2={`${factor * 2}`}
                y2={`${(factor / 6) * 17}`}
              />
            </svg>
          </defs>
          <g className={`stroke-primary stroke-[2]`}>
            <line
              x1={`${factor * 3}`}
              y1="0"
              x2={`${factor * 3}`}
              y2={`${factor * 9}`}
            />
            <line
              x1={`${factor * 6}`}
              y1="0"
              x2={`${factor * 6}`}
              y2={`${factor * 9}`}
            />
            <line
              x1="0"
              y1={`${factor * 3}`}
              x2={`${factor * 9}`}
              y2={`${factor * 3}`}
            />
            <line
              x1="0"
              y1={`${factor * 6}`}
              x2={`${factor * 9}`}
              y2={`${factor * 6}`}
            />
          </g>
          <g className={`stroke-secondary stroke-[1]`}>
            <use href="#small" transform={`translate(0 0)`} />
            <use href="#small" transform={`translate(${factor * 3} 0)`} />
            <use href="#small" transform={`translate(${factor * 6} 0)`} />
            <use href="#small" transform={`translate(0 ${factor * 3})`} />
            <use
              href="#small"
              transform={`translate(${factor * 3} ${factor * 3})`}
            />
            <use
              href="#small"
              transform={`translate(${factor * 6} ${factor * 3})`}
            />
            <use href="#small" transform={`translate(0 ${factor * 6})`} />
            <use
              href="#small"
              transform={`translate(${factor * 3} ${factor * 6})`}
            />
            <use
              href="#small"
              transform={`translate(${factor * 6} ${factor * 6})`}
            />
          </g>
        </svg>
        {grid.map((array, row) =>
          array.map((num, col) => (
            <Cell
              key={`${row}-${col}`}
              num={num}
              original={originalGrid[row][col] !== 0}
              highlighted={
                optAssistHighlight &&
                selectedNumber !== undefined &&
                (num === selectedNumber ||
                  notes[`${row}-${col}`].has(selectedNumber))
              }
              flagged={errors.includes(`${row}-${col}`)}
              notes={notes[`${row}-${col}`]}
              onClick={() =>
                status === 'play' &&
                selectedNumber !== undefined &&
                !originalGrid[row][col] &&
                update(row, col, selectedNumber, pencilMode)
              }
            />
          )),
        )}
      </animated.div>
    </div>
  );
};

export default Grid;
