import ScaledContainer from '@/components/containers/ScaledContainer';
import Cell from '@/games/2048/components/body/Cell';
import { use2048Store } from '@/games/2048/state';
import { createUseGesture, dragAction } from '@use-gesture/react';
import { animated } from '@react-spring/web';
import { Direction } from '../../types';
import { useRef } from 'react';

const Grid: React.FC = () => {
  const { seed, dimensions, cells, update } = use2048Store();
  const hasSwiped = useRef(false);
  const factor = 36;

  // Gestures
  const useGesture = createUseGesture([dragAction]);
  const binds = useGesture(
    {
      onDragEnd: ({ down, movement: [mx, my], last }) => {
        if (hasSwiped.current) return;

        if (!down && !last) return; // ignore until drag starts

        // Check if threshold exceeded and swipe hasn't been triggered yet
        if (!hasSwiped.current) {
          if (Math.abs(mx) > 100 || Math.abs(my) > 100) {
            let direction = null;

            if (Math.abs(mx) > Math.abs(my)) {
              direction = mx > 0 ? 'right' : 'left';
            } else {
              direction = my > 0 ? 'down' : 'up';
            }

            hasSwiped.current = true;
            update(direction as Direction);
          }
        }

        if (last) {
          hasSwiped.current = false; // reset for the next drag
        }
      },
    },
    { eventOptions: { passive: false } },
  );

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
          className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
          style={{
            height: dimensions[0] * factor,
            width: dimensions[1] * factor,
          }}
        >
          <animated.div
            className={`absolute grid h-full w-full`}
            style={{
              gridTemplateColumns: `repeat(${dimensions[1]},minmax(0,1fr))`,
            }}
          >
            <animated.svg
              className="pointer-events-none absolute inset-0"
              viewBox={`0 0 ${dimensions[1] * factor} ${dimensions[0] * factor}`}
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
                {Array.from({ length: dimensions[0] - 1 }).map((_, row) =>
                  Array.from({ length: dimensions[1] }).map((_, col) => (
                    <use
                      key={`hline ${row}-${col}`}
                      href="#hline"
                      transform={`translate(${col * factor} ${row * factor})`}
                    />
                  )),
                )}
                {Array.from({ length: dimensions[0] }).map((_, row) =>
                  Array.from({ length: dimensions[1] - 1 }).map((_, col) => (
                    <use
                      key={`vline ${row}-${col}`}
                      href="#vline"
                      transform={`translate(${col * factor} ${row * factor})`}
                    />
                  )),
                )}
              </g>
            </animated.svg>
          </animated.div>
          {cells.map((cell) => (
            <Cell
              key={cell.id}
              id={cell.id}
              row={cell.row}
              col={cell.col}
              num={cell.value}
              factor={factor}
            />
          ))}
        </ScaledContainer>
      </div>
    )
  );
};

export default Grid;
