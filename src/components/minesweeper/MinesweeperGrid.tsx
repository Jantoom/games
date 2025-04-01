import React, { useEffect, useRef } from 'react';
import MinesweeperCell from './MinesweeperCell';
import { useMinesweeperState } from '@/states/minesweeperState';
import { createUseGesture, dragAction, pinchAction, wheelAction } from '@use-gesture/react';
import { animated, useSpring, config } from '@react-spring/web';
import { clamp } from 'framer-motion';

const MinesweeperGrid: React.FC = () => {
  const {
    dimensions,
    grid,
    bombs,
    flags,
    flagOnClick,
    flagOnDoubleClick,
    flagOnLongClick,
    flagOnRightClick,
    update,
  } = useMinesweeperState();
  // Grid transform
  const gridRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const svgFactor = 30;
  const [{ x, y, top, bottom, left, right }, posApi] = useSpring(() => ({ x: 0, y: 0, top: 0, bottom: 0, left: 0, right: 0, config: config.stiff }));
  const [{ scale, min, max }, scaleApi] = useSpring(() => ({ scale: 0.01, min: 0, max: 0, config: config.stiff }));
  // Gestures
  const useGesture = createUseGesture([dragAction, pinchAction, wheelAction]);
  const clickTimeout = useRef<NodeJS.Timeout>(null);
  const longClickTimeout = useRef<NodeJS.Timeout>(null);
  const startClickPos = useRef<{ x: number; y: number }>(null);
  const mousePos = useRef<{ x: number; y: number }>(null);

  const calcXYBounds = (scale: number) => {
    const normalisedScale = (scale - min.get()) / (max.get() - min.get());
    const vBound = Math.max(0, (gridRef.current.clientHeight * scale - gridContainerRef.current.clientHeight) / 2 + 100 * normalisedScale);
    const hBound = Math.max(0, (gridRef.current.clientWidth * scale - gridContainerRef.current.clientWidth) / 2 + 100 * normalisedScale);
    return { top: -vBound, bottom: vBound, left: -hBound, right: hBound };
  }

  const getCellFromPosition = (position: { x: number, y: number }) => {
    const key = document.elementFromPoint(position.x, position.y).closest('[data-id]')?.getAttribute('data-id');
    if (!key) return null;
    const cell = key ? key.split('-').map((val) => +val) : null;
    return { row: cell[0], col: cell[1] };
  };

  const tryUpdate = (startPos: { x: number, y: number }, finishPos: { x: number, y: number }, flagCheck: boolean) => {
    const startClickCell = getCellFromPosition(startPos);
    const finishClickCell = getCellFromPosition(finishPos);
    if (
      Math.abs(startPos.x - finishPos.x) < 20 && Math.abs(startPos.y - finishPos.y) < 20 &&
      startClickCell && finishClickCell && startClickCell.row === finishClickCell.row && startClickCell.col === finishClickCell.col
    ) {
      update(finishClickCell.row, finishClickCell.col, flagCheck);
    }
    startClickPos.current = null;
  };

  const binds = useGesture(
    {
      onDrag: ({ offset: [ox, oy], lastOffset: [lx, ly], down, first, memo, event }) => {
        if (first) memo = { x: x.get(), y: y.get() }
        const leniency = down ? 50 * scale.get() / 2 : 0;
        const elasticX = clamp(left.get() - leniency, right.get() + leniency, memo.x + (ox - lx) * scale.get() / (event instanceof TouchEvent ? 1 : 2));
        const elasticY = clamp(top.get() - leniency, bottom.get() + leniency, memo.y + (oy - ly) * scale.get() / (event instanceof TouchEvent ? 1 : 2));
        posApi.start({ x: elasticX, y: elasticY });
        return memo;
      },
      onPinch: ({ offset: [os,], lastOffset: [ls,], active, first, memo, ...rest }) => {
        if (first) memo = { scale: scale.get() }
        const leniency = active ? 0.1 : 0;
        const elasticScale = clamp(min.get() * (1 - leniency), max.get() * (1 + leniency), memo.scale + (os - ls) / (max.get() - min.get()));
        const { top, bottom, left, right } = calcXYBounds(elasticScale);
        scaleApi.start({ scale: elasticScale });
        posApi.start({ x: clamp(top, bottom, x.get()), y: clamp(left, right, y.get()), top, bottom, left, right });
        return memo;
      },
      onWheel: ({ offset: [, oy], lastOffset: [, ly], active, first, memo }) => {
        if (first) memo = { scale: scale.get() }
        const leniency = active ? 0.1 : 0;
        const elasticScale = clamp(min.get() * (1 - leniency), max.get() * (1 + leniency), memo.scale - (oy - ly) / (max.get() - min.get()) / 100);
        const { top, bottom, left, right } = calcXYBounds(elasticScale);
        scaleApi.start({ scale: elasticScale });
        posApi.start({ x: clamp(top, bottom, x.get()), y: clamp(left, right, y.get()), top, bottom, left, right });
        return memo;
      },
      onPointerDown: ({ event }) => {
        if (startClickPos.current) return; // Needs to be consumed by something else
        startClickPos.current = { x: event.clientX, y: event.clientY }
        clearTimeout(longClickTimeout.current);
        longClickTimeout.current = setTimeout(() => {
          longClickTimeout.current = null;
          tryUpdate(startClickPos.current, mousePos.current, flagOnLongClick);
        }, 500);
      },
      onClick: ({ event }) => {
        if (!startClickPos.current) return;
        clearTimeout(clickTimeout.current);
        if (longClickTimeout.current) {
          // Long click hasn't cleared itself yet
          clearTimeout(longClickTimeout.current);
          longClickTimeout.current = null;
          clickTimeout.current = setTimeout(() => {
            tryUpdate(startClickPos.current, { x: event.clientX, y: event.clientY }, flagOnClick);
          }, 500);
        }
      },
      onDoubleClick: ({ event }) => {
        if (!startClickPos.current) return;
        tryUpdate(startClickPos.current, { x: event.clientX, y: event.clientY }, flagOnDoubleClick);
      },
      onContextMenu: ({ event }) => {
        event.preventDefault();
        if (!startClickPos.current) return;
        clearTimeout(clickTimeout.current);
        clearTimeout(longClickTimeout.current);
        longClickTimeout.current = null;
        tryUpdate(startClickPos.current, { x: event.clientX, y: event.clientY }, flagOnRightClick);
      },
    },
    { eventOptions: { passive: false } },
  );

  useEffect(() => {
    if (!gridRef.current || !gridContainerRef.current) return;
    const min = Math.min(
      gridContainerRef.current.clientHeight / gridRef.current.clientHeight,
      gridContainerRef.current.clientWidth / gridRef.current.clientWidth,
    ) * 0.9; // Small enough to fit whole grid in 90% of the container
    const max = Math.max(min,
      gridContainerRef.current.clientHeight /
      ((10 * Math.max(gridRef.current.clientHeight, gridRef.current.clientWidth)) /
        Math.max(...dimensions))); // Big enough to fit 10 cells vertically
    scaleApi.start({ scale: min, min, max });
  }, [dimensions]);

  return (
    dimensions[0] > 0 && (
      <div {...binds()} className="flex flex-col h-full justify-center" style={{ touchAction: 'none', userSelect: 'none' }}>
        <div
          ref={gridContainerRef}
          className="flex flex-col items-center justify-center w-[95vw] h-[85vh] overflow-hidden"
        >
          <animated.div
            ref={gridRef}
            onMouseMove={(event) => {
              mousePos.current = { x: event.clientX, y: event.clientY };
            }}
            className={`grid relative`}
            style={{
              gridTemplateColumns: `repeat(${dimensions[1]},minmax(0,1fr))`,
              height: dimensions[0] * svgFactor,
              width: dimensions[1] * svgFactor,
              x,
              y,
              scale,
            }}
          >
            <svg
              className="absolute inset-0 pointer-events-none"
              viewBox={`0 0 ${dimensions[1] * svgFactor} ${dimensions[0] * svgFactor}`}
            >
              <defs>
                <line
                  id="hline"
                  x1={`${svgFactor / 6}`}
                  y1={`${svgFactor}`}
                  x2={`${(svgFactor / 6) * 5}`}
                  y2={`${svgFactor}`}
                />
                <line
                  id="vline"
                  x1={`${svgFactor}`}
                  y1={`${svgFactor / 6}`}
                  x2={`${svgFactor}`}
                  y2={`${(svgFactor / 6) * 5}`}
                />
              </defs>
              <g className="stroke-primary stroke-[0.5]">
                {Array(grid.length - 1)
                  .fill(null)
                  .map((_, row) =>
                    Array(grid[0].length)
                      .fill(null)
                      .map((_, col) => (
                        <use
                          key={`hline ${row}-${col}`}
                          href="#hline"
                          transform={`translate(${col * svgFactor} ${row * svgFactor})`}
                        />
                      )),
                  )}
                {Array(grid.length)
                  .fill(null)
                  .map((_, row) =>
                    Array(grid[0].length - 1)
                      .fill(null)
                      .map((_, col) => (
                        <use
                          key={`vline ${row}-${col}`}
                          href="#vline"
                          transform={`translate(${col * svgFactor} ${row * svgFactor})`}
                        />
                      )),
                  )}
              </g>
            </svg>

            {grid.map((array, row) =>
              array.map((num, col) => (
                <MinesweeperCell
                  key={`${row}-${col}`}
                  id={`${row}-${col}`}
                  num={num}
                  isFlagged={flags.has(`${row}-${col}`)}
                  isExploded={bombs.has(`${row}-${col}`) && num != -1}
                />
              )),
            )}
          </animated.div>
        </div>
      </div>
    )
  );
};

export default MinesweeperGrid;
