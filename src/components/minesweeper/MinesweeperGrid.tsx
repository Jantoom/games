import React, { useEffect, useRef } from 'react';
import MinesweeperCell from './MinesweeperCell';
import { useMinesweeperState } from '@/states/minesweeperState';

interface MinesweeperGridProps {
  update: (row: number, col: number) => void;
}

const MinesweeperGridLines: React.FC = () => {
  const { solvedGrid } = useMinesweeperState();

  useEffect(() => {
    if (solvedGrid.length === 0) return;
    const space = 150;

    const svg = document.getElementById('svggrid');
    svg.setAttribute(
      'viewBox',
      `0 0 ${solvedGrid[0].length * space} ${solvedGrid.length * space}`,
    );
    svg.querySelectorAll('g').forEach((group) => group.remove());

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'stroke-primary stroke-[1.5]');

    for (let row = 0; row < solvedGrid.length - 1; row++) {
      for (let col = 0; col < solvedGrid[0].length; col++) {
        const hline = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'use',
        );
        hline.setAttribute('href', '#hline');
        hline.setAttribute(
          'transform',
          `translate(${col * space}, ${row * space})`,
        );
        g.appendChild(hline);
      }
    }

    for (let row = 0; row < solvedGrid.length; row++) {
      for (let col = 0; col < solvedGrid[0].length - 1; col++) {
        const vline = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'use',
        );
        vline.setAttribute('href', '#vline');
        vline.setAttribute(
          'transform',
          `translate(${col * space}, ${row * space})`,
        );
        g.appendChild(vline);
      }
    }

    svg.appendChild(g);
  }, [solvedGrid]);

  return <></>;
};

const MinesweeperGrid: React.FC<MinesweeperGridProps> = ({ update }) => {
  const { isActive, grid } = useMinesweeperState();

  return (
    <div className="flex flex-col h-full justify-center">
      <div
        id="divgrid"
        className={`grid relative w-[min(95vw,50vh)]`}
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length},minmax(0,1fr))`,
        }}
      >
        {grid.map((array, row) =>
          array.map((num, col) => (
            <MinesweeperCell
              key={`${row}-${col}`}
              num={num}
              onClick={() => isActive && update(row, col)}
            />
          )),
        )}
        <div className="absolute inset-0 pointer-events-none">
          <svg id="svggrid">
            <defs>
              <line id="hline" x1="25" y1="150" x2="125" y2="150" />
              <line id="vline" x1="150" y1="25" x2="150" y2="125" />
            </defs>
          </svg>
        </div>

        <MinesweeperGridLines />
      </div>
    </div>
  );
};

export default MinesweeperGrid;
