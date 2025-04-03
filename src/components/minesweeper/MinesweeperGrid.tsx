import React, { useEffect, useRef } from 'react';
import MinesweeperCell from './MinesweeperCell';
import { useMinesweeperState } from '@/states/minesweeperState';
import {
  createUseGesture,
  dragAction,
  pinchAction,
  wheelAction,
} from '@use-gesture/react';
import { animated, useSpring, config } from '@react-spring/web';
import { clamp } from 'framer-motion';

const MinesweeperGrid: React.FC = () => {
  const {
    dimensions,
    isActive,
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
  const [{ x, y, top, bottom, left, right }, posApi] = useSpring(() => ({
    x: 0,
    y: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    config: config.stiff,
  }));
  const [{ scale, min, max, opacity }, scaleApi] = useSpring(() => ({
    scale: 1,
    min: 0,
    max: 0,
    opacity: 0,
    config: config.stiff,
  }));
  // Gestures
  const useGesture = createUseGesture([dragAction, pinchAction, wheelAction]);
  const clickTimeout = useRef<NodeJS.Timeout>(null);
  const longClickTimeout = useRef<NodeJS.Timeout>(null);
  const prevClickPos = useRef<{ x: number; y: number }>(null);
  const currClickPos = useRef<{ x: number; y: number }>(null);
  const mousePos = useRef<{ x: number; y: number }>(null);

  const updatePos = (
    lenient: boolean,
    memo: [number, number],
    offset: [number, number],
    lastOffset: [number, number],
    calibration: number,
  ) => {
    const leniency = lenient ? (50 * scale.get()) / 2 : 0;
    const x = clamp(
      left.get() - leniency,
      right.get() + leniency,
      memo[0] + ((offset[0] - lastOffset[0]) * scale.get()) / calibration,
    );
    const y = clamp(
      top.get() - leniency,
      bottom.get() + leniency,
      memo[1] + ((offset[1] - lastOffset[1]) * scale.get()) / calibration,
    );
    posApi.start({ x, y });
  };

  const updateScale = (
    lenient: boolean,
    memo: number,
    offset: number,
    lastOffset: number,
    origin: [number, number],
    calibration: number,
  ) => {
    const leniency = lenient ? 0.1 : 0;
    const scale = clamp(
      min.get() * (1 - leniency),
      max.get() * (1 + leniency),
      memo + (offset - lastOffset) / (max.get() - min.get()) / calibration,
    );
    const normalisedScale = (scale - min.get()) / (max.get() - min.get());
    const opacity = Math.min(
      1,
      (scale - min.get() + 0.01) / (max.get() - min.get()),
    );
    const vBound = Math.max(
      0,
      (gridRef.current.clientHeight * scale -
        gridContainerRef.current.clientHeight) /
        2 +
        100 * normalisedScale,
    );
    const hBound = Math.max(
      0,
      (gridRef.current.clientWidth * scale -
        gridContainerRef.current.clientWidth) /
        2 +
        100 * normalisedScale,
    );
    scaleApi.start({ scale, opacity });
    posApi.start({
      x: clamp(-hBound, hBound, -origin[0] * normalisedScale ** 2),
      y: clamp(-vBound, vBound, -origin[1] * normalisedScale ** 2),
      top: -vBound,
      bottom: vBound,
      left: -hBound,
      right: hBound,
      config: config.stiff,
    });
  };

  const getCellFromPosition = (position: { x: number; y: number }) => {
    if (!position) return null;
    const key = document
      .elementFromPoint(position.x, position.y)
      .closest('[data-id]')
      ?.getAttribute('data-id');
    if (!key) return null;
    const cell = key ? key.split('-').map((val) => +val) : null;
    return { row: cell[0], col: cell[1] };
  };

  const positionCellsAreEqual = (
    pos1: { x: number; y: number },
    pos2: { x: number; y: number },
  ) => {
    const cell1 = getCellFromPosition(pos1);
    const cell2 = getCellFromPosition(pos2);
    return cell1 && cell2 && cell1.row === cell2.row && cell1.col === cell2.col;
  };

  const tryUpdate = (
    startPos: { x: number; y: number },
    finishPos: { x: number; y: number },
    flagCheck: boolean,
  ) => {
    const updateCell = getCellFromPosition(finishPos);
    if (
      Math.abs(startPos.x - finishPos.x) < 20 &&
      Math.abs(startPos.y - finishPos.y) < 20 &&
      positionCellsAreEqual(startPos, finishPos)
    ) {
      update(updateCell.row, updateCell.col, flagCheck);
    }
  };

  const binds = useGesture(
    {
      onDrag: ({ first, down, memo, offset, lastOffset, event }) => {
        if (first) memo = [x.get(), y.get()];
        const calibration = event instanceof TouchEvent ? 1 : 2;
        updatePos(down, memo, offset, lastOffset, calibration);
        return memo;
      },
      onPinch: ({ first, active, memo, offset, lastOffset, origin }) => {
        if (first) memo = scale.get();
        const grid = gridRef.current.getBoundingClientRect();
        origin = [
          origin[0] - (grid.x + grid.width / 2),
          origin[1] - (grid.y + grid.height / 2),
        ];
        updateScale(active, memo, offset[0], lastOffset[0], origin, 1);
        return memo;
      },
      onWheel: ({ first, active, memo, offset, lastOffset }) => {
        if (first) memo = scale.get();
        const grid = gridRef.current.getBoundingClientRect();
        const origin: [number, number] = [
          mousePos.current.x - (grid.x + grid.width / 2),
          mousePos.current.y - (grid.y + grid.height / 2),
        ];
        updateScale(active, memo, -offset[1], -lastOffset[1], origin, 200);
        return memo;
      },
      onPointerDown: ({ event }) => {
        prevClickPos.current = currClickPos.current;
        currClickPos.current = { x: event.clientX, y: event.clientY };

        clearTimeout(longClickTimeout.current);
        longClickTimeout.current = setTimeout(
          (pos) => {
            tryUpdate(pos.start, mousePos.current, flagOnLongClick);
            longClickTimeout.current = null;
          },
          250,
          { start: { ...currClickPos.current } },
        );
      },
      onClick: ({ event }) => {
        if (!currClickPos.current) return;
        if (positionCellsAreEqual(prevClickPos.current, currClickPos.current)) {
          clearTimeout(clickTimeout.current);
        }
        if (longClickTimeout.current) {
          clearTimeout(longClickTimeout.current);
          longClickTimeout.current = null;
          clickTimeout.current = setTimeout(
            (pos) => {
              tryUpdate(pos.start, pos.finish, flagOnClick);
              clickTimeout.current = null;
            },
            250,
            {
              start: { ...currClickPos.current },
              finish: { x: event.clientX, y: event.clientY },
            },
          );
        }
      },
      onDoubleClick: ({ event }) => {
        if (!currClickPos.current) return;
        tryUpdate(
          { ...currClickPos.current },
          { x: event.clientX, y: event.clientY },
          flagOnDoubleClick,
        );
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
      },
      onContextMenu: ({ event }) => {
        event.preventDefault();
        if (!currClickPos.current) return;
        tryUpdate(
          { ...currClickPos.current },
          { x: event.clientX, y: event.clientY },
          flagOnRightClick,
        );
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
        clearTimeout(longClickTimeout.current);
        longClickTimeout.current = null;
      },
    },
    { eventOptions: { passive: false } },
  );

  useEffect(() => {
    if (!gridRef.current || !gridContainerRef.current) return;
    const min =
      Math.min(
        gridContainerRef.current.clientHeight / gridRef.current.clientHeight,
        gridContainerRef.current.clientWidth / gridRef.current.clientWidth,
      ) * 0.9; // Small enough to fit whole grid in 90% of the container
    const max = Math.max(
      min,
      gridContainerRef.current.clientHeight /
        ((10 *
          Math.max(gridRef.current.clientHeight, gridRef.current.clientWidth)) /
          Math.max(...dimensions)),
    ); // Big enough to fit 10 cells vertically
    scaleApi.start({
      scale: min,
      min,
      max,
      opacity: Math.min(1, 0.01 / (max - min)),
    });
  }, [dimensions, scaleApi]);

  useEffect(() => {
    if (!isActive) {
      scaleApi.start({
        scale: min.get(),
        opacity: Math.min(1, 0.01 / (max.get() - min.get())),
        config: config.slow,
      });
      posApi.start({ x: 0, y: 0, config: config.slow });
    }
  }, [isActive]);

  return (
    dimensions[0] > 0 && (
      <div
        {...binds()}
        className="flex flex-col h-full justify-center"
        style={{
          touchAction: 'none',
          userSelect: 'none',
          msUserSelect: 'none',
          msTouchAction: 'none',
        }}
      >
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
            <animated.svg
              className="absolute inset-0 pointer-events-none"
              viewBox={`0 0 ${dimensions[1] * svgFactor} ${dimensions[0] * svgFactor}`}
              style={{ opacity: opacity }}
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
            </animated.svg>

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
