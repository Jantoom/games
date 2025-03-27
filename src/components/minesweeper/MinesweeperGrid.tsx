import React, { useEffect, useRef, useState } from 'react';
import MinesweeperCell from './MinesweeperCell';
import { useMinesweeperState } from '@/states/minesweeperState';
import { createUseGesture, pinchAction, wheelAction } from '@use-gesture/react';
import { clamp, motion, useMotionValue } from 'framer-motion';

const MinesweeperGrid: React.FC = () => {
  const {
    dimensions,
    grid,
    flags,
    flagOnClick,
    flagOnDoubleClick,
    flagOnLongClick,
    flagOnRightClick,
    update,
  } = useMinesweeperState();
  // Grid transform
  const svgFactor = 30;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [posBounds, setPosBounds] = useState<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  }>({ top: 0, bottom: 0, left: 0, right: 0 });
  const [scale, setScale] = useState(0);
  const [scaleBounds, setScaleBounds] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  // Gestures
  const useGesture = createUseGesture([wheelAction, pinchAction]);
  const clickTimeout = useRef(null);
  const longClickTimeout = useRef(null);
  const lastClickTime = useRef(0);
  const lastClickPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastClickCell = useRef<{ row: number; col: number }>({
    row: 0,
    col: 0,
  });
  const [clickConsumed, setClickConsumed] = useState(false);
  const mousePos = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const mouseCell = useRef<{ row: number; col: number }>({
    row: 0,
    col: 0,
  });

  const getRowColFromElement = (elem: Element) => {
    const key = elem.closest('[data-id]')?.getAttribute('data-id');
    if (!key) return null;
    const cell = key ? key.split('-').map((val) => +val) : null;
    return { row: cell[0], col: cell[1] };
  };

  const tryCachedUpdate = (flagCheck: boolean) => {
    if (
      Math.abs(lastClickPos.current?.x - mousePos.current.x) < 20 &&
      Math.abs(lastClickPos.current?.y - mousePos.current.y) < 20 &&
      lastClickCell.current.row === mouseCell.current.row &&
      lastClickCell.current.col === mouseCell.current.col
    ) {
      update(lastClickCell.current.row, lastClickCell.current.col, flagCheck);
    }
  };

  useEffect(() => {
    const grid = document.getElementById('grid');
    const gridContainer = document.getElementById('gridContainer');
    if (!grid || !gridContainer) return;

    const min =
      Math.min(
        gridContainer.clientHeight / grid.clientHeight,
        gridContainer.clientWidth / grid.clientWidth,
      ) * 0.9;

    const max = Math.max(
      min,
      gridContainer.clientHeight /
        ((10 * Math.max(grid.clientHeight, grid.clientWidth)) /
          Math.max(...dimensions)),
    );

    setScaleBounds({ min, max });
  }, [dimensions]);

  useEffect(() => {
    if (scale > 0) {
      const gridContainer = document.getElementById('gridContainer');
      const grid = document.getElementById('grid');
      if (!gridContainer || !grid) return;

      const normalisedScale =
        (scale - scaleBounds.min) / (scaleBounds.max - scaleBounds.min);

      const vBound = Math.max(
        0,
        (grid.clientHeight * scale - gridContainer.clientHeight) / 2 +
          100 * normalisedScale,
      );
      const hBound = Math.max(
        0,
        (grid.clientWidth * scale - gridContainer.clientWidth) / 2 +
          100 * normalisedScale,
      );
      const posBounds = {
        top: -vBound,
        bottom: vBound,
        left: -hBound,
        right: hBound,
      };
      x.set(
        Math.sign(x.get()) === 1
          ? Math.min(x.get(), posBounds.right)
          : Math.max(x.get(), posBounds.left),
      );
      y.set(
        Math.sign(y.get()) === 1
          ? Math.min(y.get(), posBounds.bottom)
          : Math.max(y.get(), posBounds.top),
      );
      setPosBounds(posBounds);
    } else if (scale === 0 && scaleBounds.min > 0) {
      setScale(scaleBounds.min);
    }
  }, [scale, scaleBounds, x, y]);

  const binds = useGesture(
    {
      onWheel: ({ event, delta: [, dy] }) => {
        setScale((prev) =>
          clamp(scaleBounds.min, scaleBounds.max, prev - dy * 0.001),
        );
      },
      onPinch: ({ event, offset: [d] }) => {
        setScale(clamp(scaleBounds.min, scaleBounds.max, d ** 200));
      },
      onPointerDown: ({ event }) => {
        lastClickCell.current = getRowColFromElement(event.target as Element);
        if (!lastClickCell.current || event.button === 2) return;
        const now = Date.now();

        if (now - lastClickTime.current < 300) {
          clearTimeout(clickTimeout.current);
          mouseCell.current = getRowColFromElement(event.target as Element);
          tryCachedUpdate(flagOnDoubleClick);
          setClickConsumed(true);
        } else {
          longClickTimeout.current = setTimeout(() => {
            const elem = document.elementFromPoint(
              mousePos.current.x,
              mousePos.current.y,
            );
            mouseCell.current = getRowColFromElement(elem);
            tryCachedUpdate(flagOnLongClick);
            setClickConsumed(true);
          }, 500);
        }

        lastClickPos.current = { ...mousePos.current };
        lastClickTime.current = now;
      },
      onPointerUp: ({ event }) => {
        lastClickCell.current = getRowColFromElement(event.target as Element);
        if (!lastClickCell.current || event.button === 2) return;
        clearTimeout(longClickTimeout.current);

        if (!clickConsumed) {
          clickTimeout.current = setTimeout(() => {
            update(
              lastClickCell.current.row,
              lastClickCell.current.col,
              flagOnClick,
            );
          }, 300);
        }

        setClickConsumed(false);
      },
      onContextMenu: ({ event }) => {
        event.preventDefault();
        clearTimeout(longClickTimeout.current);
        lastClickCell.current = getRowColFromElement(event.target as Element);

        if (lastClickCell.current) {
          update(
            lastClickCell.current.row,
            lastClickCell.current.col,
            flagOnRightClick,
          );
        }
      },
    },
    {
      eventOptions: { passive: false },
    },
  );

  return (
    dimensions[0] > 0 && (
      <div {...binds()} className="flex flex-col h-full justify-center">
        <div
          id="gridContainer"
          className="flex flex-col items-center justify-center w-[95vw] h-[85vh] overflow-hidden"
        >
          <motion.div
            id="grid"
            drag
            dragConstraints={posBounds}
            dragElastic={0.3}
            dragTransition={{ power: 0.2, timeConstant: 200 }}
            onMouseMove={(event) => {
              mousePos.current = { x: event.clientX, y: event.clientY };
            }}
            className={`grid relative`}
            style={{
              height: dimensions[0] * svgFactor,
              width: dimensions[1] * svgFactor,
              x,
              y,
              scale,
              gridTemplateColumns: `repeat(${dimensions[1]},minmax(0,1fr))`,
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
                />
              )),
            )}
          </motion.div>
        </div>
      </div>
    )
  );
};

export default MinesweeperGrid;
