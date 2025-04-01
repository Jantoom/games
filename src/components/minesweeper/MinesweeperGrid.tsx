import React, { useEffect, useRef, useState } from 'react';
import MinesweeperCell from './MinesweeperCell';
import { useMinesweeperState } from '@/states/minesweeperState';
import { createUseGesture, dragAction, pinchAction, wheelAction } from '@use-gesture/react';
import { animated, useSpring, config } from '@react-spring/web';
import { clamp, motion, useMotionValue } from 'framer-motion';

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
  const gridRef = useRef(null);
  const gridContainerRef = useRef(null);
  const svgFactor = 30;
  const [{ x, y, top, bottom, left, right }, posApi] = useSpring(() => ({ x: 0, y: 0, top: 0, bottom: 0, left: 0, right: 0 }));
  const [{ scale, min, max }, scaleApi] = useSpring(() => ({ scale: 0.01, min: 0, max: 0, config: config.stiff }));
  // Gestures
  const useGesture = createUseGesture([dragAction, pinchAction, wheelAction]);
  const dragStartPos = useRef([0, 0]);
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
      lastClickPos &&
      lastClickCell.current &&
      mouseCell.current &&
      Math.abs(lastClickPos.current?.x - mousePos.current.x) < 20 &&
      Math.abs(lastClickPos.current?.y - mousePos.current.y) < 20 &&
      lastClickCell.current.row === mouseCell.current.row &&
      lastClickCell.current.col === mouseCell.current.col
    ) {
      update(lastClickCell.current.row, lastClickCell.current.col, flagCheck);
    }
  };

  useEffect(() => {
    if (!gridRef.current || !gridContainerRef.current) return;

    const min =
      Math.min(
        gridContainerRef.current.clientHeight / gridRef.current.clientHeight,
        gridContainerRef.current.clientWidth / gridRef.current.clientWidth,
      ) * 0.9;

    const max = Math.max(
      min,
      gridContainerRef.current.clientHeight /
      ((10 * Math.max(gridRef.current.clientHeight, gridRef.current.clientWidth)) /
        Math.max(...dimensions)),
    );

    scaleApi.start({ scale: min, min, max });
    console.log(min, max)
    setTimeout(() => console.log(scale.get()), 1000)
  }, [dimensions]);

  const calcXYBounds = (scale: number) => {
    if (!grid || !gridRef.current || !gridContainerRef.current) return;

    const normalisedScale =
      (scale - min.get()) / (max.get() - min.get());


    const vBound = Math.max(
      0,
      (gridRef.current.clientHeight * scale - gridContainerRef.current.clientHeight) / 2 +
      100 * normalisedScale,
    );
    const hBound = Math.max(
      0,
      (gridRef.current.clientWidth * scale - gridContainerRef.current.clientWidth) / 2 +
      100 * normalisedScale,
    );
    const posBounds = {
      top: -vBound,
      bottom: vBound,
      left: -hBound,
      right: hBound,
    };

    return posBounds;
  }

  const binds = useGesture(
    {
      onDrag: ({ movement: [ox, oy], down, first }) => {
        // Calculate elasticity effect when panning beyond limits
        if (first) dragStartPos.current = [x.get(), y.get()]
        const leniency = down ? 50 * scale.get() / 2 : 0;
        const elasticX = clamp(left.get() - leniency, right.get() + leniency, dragStartPos.current[0] + ox * scale.get() / 2);
        const elasticY = clamp(top.get() - leniency, bottom.get() + leniency, dragStartPos.current[1] + oy * scale.get() / 2);
        // If no longer panning but axis is beyond limits, snap back
        const xConfig = !down && clamp(left.get(), right.get(), x.get()) != x.get() ? config.stiff : config.molasses;
        const yConfig = !down && clamp(top.get(), bottom.get(), y.get()) != y.get() ? config.stiff : config.molasses;
        
        posApi.start({ x: elasticX, config: xConfig });
        posApi.start({ y: elasticY, config: yConfig });
      },
      onPinch: ({ offset: [d], active }) => {
        // scaleApi.start({ scale: clamp(min.get(), max.get(), (d * 2) ** 2) });
        // Calculate elasticity effect when zooming beyond limits
        const leniency = active ? 0.1 : 0;
        const elasticScale = clamp(min.get() * (1 - leniency), max.get() * (1 + leniency), scale.get() - d / (max.get() - min.get()) / 1.75);
        const { top, bottom, left, right } = calcXYBounds(elasticScale);

        scaleApi.start({ scale: elasticScale });
        posApi.start({ x: clamp(top, bottom, x.get()), y: clamp(left, right, y.get()), top, bottom, left, right });
      },
      onWheel: ({ direction: [, dy], active }) => {
        // Calculate elasticity effect when zooming beyond limits
        const leniency = active ? 0.1 : 0;
        const elasticScale = clamp(min.get() * (1 - leniency), max.get() * (1 + leniency), scale.get() - dy / (max.get() - min.get()) / 1.75);
        const { top, bottom, left, right } = calcXYBounds(elasticScale);

        scaleApi.start({ scale: elasticScale });
        posApi.start({ x: clamp(top, bottom, x.get()), y: clamp(left, right, y.get()), top, bottom, left, right });
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
            if (lastClickCell.current) {
              update(
                lastClickCell.current.row,
                lastClickCell.current.col,
                flagOnClick,
              );
            }
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
      <div {...binds()} className="flex flex-col h-full justify-center" style={{ touchAction: 'none' }}>
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
