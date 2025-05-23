import { animated, useSpring, config } from '@react-spring/web';
import {
  createUseGesture,
  dragAction,
  pinchAction,
  wheelAction,
} from '@use-gesture/react';
import { clamp } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import ScaledContainer from '@/components/containers/ScaledContainer';
import Cell from '@/games/minesweeper/components/body/Cell';
import { useMinesweeperStore } from '@/games/minesweeper/state';
import {
  getCellFromPosition,
  positionCellsAreEqual,
} from '@/games/minesweeper/utils';

const Grid: React.FC = () => {
  const {
    status,
    seed,
    dimensions,
    grid,
    bombs,
    flags,
    flagMode,
    optFlagOnClick,
    optFlagOnDoubleClick,
    optFlagOnLongClick,
    optFlagOnRightClick,
    update,
  } = useMinesweeperStore();

  // Grid transform
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const factor = 30;
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
  const updatePos = (
    lenient: boolean,
    memo: [number, number],
    offset: [number, number],
    lastOffset: [number, number],
    calibration: number,
  ): void => {
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
    void posApi.start({ x, y });
  };
  const updateScale = (
    lenient: boolean,
    memo: number,
    offset: number,
    lastOffset: number,
    origin: [number, number],
    calibration: number,
  ): void => {
    const leniency = lenient ? 0.1 : 0;
    const scale = clamp(
      min.get() * (1 - leniency),
      max.get() * (1 + leniency),
      memo + (offset - lastOffset) / (max.get() - min.get()) / calibration,
    );
    const normalisedScale = (scale - min.get()) / (max.get() - min.get());
    const opacity = Math.min(1, max.get() - (max.get() - scale) - 1);
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
    void scaleApi.start({ scale, opacity });
    void posApi.start({
      x: clamp(-hBound, hBound, -origin[0] * normalisedScale ** 2),
      y: clamp(-vBound, vBound, -origin[1] * normalisedScale ** 2),
      top: -vBound,
      bottom: vBound,
      left: -hBound,
      right: hBound,
      config: config.stiff,
    });
  };
  // Set scale and position when grid is created
  useEffect(() => {
    if (!gridRef.current || !gridContainerRef.current) return;
    // Small enough to fit whole grid in 90% of the container
    const min =
      Math.min(
        gridContainerRef.current.clientHeight / gridRef.current.clientHeight,
        gridContainerRef.current.clientWidth / gridRef.current.clientWidth,
      ) * 0.9;
    // Big enough to fit 10 cells vertically
    const max = Math.max(
      min,
      gridContainerRef.current.clientHeight /
        ((10 *
          Math.max(gridRef.current.clientHeight, gridRef.current.clientWidth)) /
          Math.max(...dimensions)),
    );
    void scaleApi.start({
      scale: min,
      min,
      max,
      opacity: Math.min(1, max - (max - min) - 1),
    });
  }, [dimensions, scaleApi]);
  // Reset scale when game is finished
  useEffect(() => {
    if (status === 'finished' && min.get() !== 0) {
      void scaleApi.start({
        scale: min.get(),
        opacity: Math.min(1, max.get() - (max.get() - min.get()) - 1),
        config: config.slow,
      });
      void posApi.start({ x: 0, y: 0, config: config.slow });
    }
  }, [status, scaleApi, posApi, min, max]);

  // Gestures
  const useGesture = createUseGesture([dragAction, pinchAction, wheelAction]);
  const clickTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const longClickTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const prevClickPos = useRef<{ x: number; y: number } | undefined>(undefined);
  const currClickPos = useRef<{ x: number; y: number } | undefined>(undefined);
  const mousePos = useRef<{ x: number; y: number } | undefined>(undefined);
  const binds = useGesture(
    {
      onDrag: ({
        first,
        down,
        memo,
        offset,
        lastOffset,
        event,
      }): [number, number] | undefined => {
        if (first) memo = [x.get(), y.get()];
        const calibration = event instanceof TouchEvent ? 1 : 2;
        updatePos(
          down,
          memo as [number, number],
          offset,
          lastOffset,
          calibration,
        );
        return memo as [number, number];
      },
      onPinch: ({
        first,
        active,
        memo,
        offset,
        lastOffset,
        origin,
      }): number | undefined => {
        if (first) memo = scale.get();
        const grid = gridRef.current.getBoundingClientRect();
        origin = [
          origin[0] - (grid.x + grid.width / 2),
          origin[1] - (grid.y + grid.height / 2),
        ];
        updateScale(
          active,
          memo as number,
          offset[0],
          lastOffset[0],
          origin,
          1,
        );
        return memo as number;
      },
      onWheel: ({
        first,
        active,
        memo,
        offset,
        lastOffset,
      }): number | undefined => {
        if (first) memo = scale.get();
        const grid = gridRef.current.getBoundingClientRect();
        const origin: [number, number] = [
          mousePos.current.x - (grid.x + grid.width / 2),
          mousePos.current.y - (grid.y + grid.height / 2),
        ];
        updateScale(
          active,
          memo as number,
          -offset[1],
          -lastOffset[1],
          origin,
          200,
        );
        return memo as number;
      },
      onPointerDown: ({ event }) => {
        prevClickPos.current = currClickPos.current;
        currClickPos.current = { x: event.clientX, y: event.clientY };

        clearTimeout(longClickTimeout.current);
        longClickTimeout.current = setTimeout(
          (pos) => {
            tryUpdate(pos.start, mousePos.current, optFlagOnLongClick);
            longClickTimeout.current = undefined;
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
          longClickTimeout.current = undefined;
          clickTimeout.current = setTimeout(
            (pos) => {
              tryUpdate(pos.start, pos.finish, optFlagOnClick);
              clickTimeout.current = undefined;
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
          optFlagOnDoubleClick,
        );
        clearTimeout(clickTimeout.current);
        clickTimeout.current = undefined;
      },
      onContextMenu: ({ event }) => {
        event.preventDefault();
        if (!currClickPos.current) return;
        tryUpdate(
          { ...currClickPos.current },
          { x: event.clientX, y: event.clientY },
          optFlagOnRightClick,
        );
        clearTimeout(clickTimeout.current);
        clickTimeout.current = undefined;
        clearTimeout(longClickTimeout.current);
        longClickTimeout.current = undefined;
      },
    },
    { eventOptions: { passive: false } },
  );
  const tryUpdate = (
    startPos: { x: number; y: number },
    finishPos: { x: number; y: number },
    flagCheck: boolean,
  ): void => {
    const updateCell = getCellFromPosition(finishPos);
    if (
      updateCell &&
      Math.abs(startPos.x - finishPos.x) < 20 &&
      Math.abs(startPos.y - finishPos.y) < 20 &&
      positionCellsAreEqual(startPos, finishPos)
    ) {
      update(updateCell.row, updateCell.col, flagCheck || flagMode);
    }
  };

  return (
    dimensions[0] > 0 && (
      <div
        {...binds()}
        key={seed}
        className="flex h-full w-full items-center"
        style={{
          touchAction: 'none',
          userSelect: 'none',
          msUserSelect: 'none',
          msTouchAction: 'none',
        }}
      >
        <ScaledContainer
          cref={gridContainerRef}
          className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
          style={{
            height: dimensions[0] * factor,
            width: dimensions[1] * factor,
          }}
        >
          <animated.div
            ref={gridRef}
            onMouseMove={(event) => {
              mousePos.current = { x: event.clientX, y: event.clientY };
            }}
            className={`absolute grid h-full w-full`}
            style={{
              gridTemplateColumns: `repeat(${dimensions[1]},minmax(0,1fr))`,
              x,
              y,
              scale,
            }}
          >
            <animated.svg
              className="pointer-events-none absolute inset-0"
              viewBox={`0 0 ${dimensions[1] * factor} ${dimensions[0] * factor}`}
              style={{ opacity: opacity }}
            >
              <defs>
                <line
                  id="hline"
                  x1={`${factor / 6}`}
                  y1={`${factor}`}
                  x2={`${(factor / 6) * 5}`}
                  y2={`${factor}`}
                />
                <line
                  id="vline"
                  x1={`${factor}`}
                  y1={`${factor / 6}`}
                  x2={`${factor}`}
                  y2={`${(factor / 6) * 5}`}
                />
              </defs>
              <g className="stroke-primary stroke-[0.5]">
                {Array.from({ length: grid.length - 1 }).map((_, row) =>
                  Array.from({ length: grid[0].length }).map((_, col) => (
                    <use
                      key={`hline ${row}-${col}`}
                      href="#hline"
                      transform={`translate(${col * factor} ${row * factor})`}
                    />
                  )),
                )}
                {Array.from({ length: grid.length }).map((_, row) =>
                  Array.from({ length: grid[0].length - 1 }).map((_, col) => (
                    <use
                      key={`vline ${row}-${col}`}
                      href="#vline"
                      transform={`translate(${col * factor} ${row * factor})`}
                    />
                  )),
                )}
              </g>
            </animated.svg>

            {grid.map((array, row) =>
              array.map((num, col) => (
                <Cell
                  key={`${row}-${col}`}
                  id={`${row}-${col}`}
                  num={num}
                  flagged={flags.has(`${row}-${col}`)}
                  exploded={bombs.has(`${row}-${col}`) && num != undefined}
                />
              )),
            )}
          </animated.div>
        </ScaledContainer>
      </div>
    )
  );
};

export default Grid;
