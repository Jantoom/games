import React from 'react';
import { Link } from 'react-router-dom';
import BasicPage from '@/components/containers/BasicPage';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/lib/state';

const Menu: React.FC = () => {
  const { setState } = useGlobalStore();
  const games = [
    'sudoku',
    'minesweeper',
    // 'solitaire',
    // 'snake',
    // 'pong',
    '2048',
    // 'traffic',
  ];
  return (
    <BasicPage>
      <div className="flex w-full flex-col gap-y-4">
        {games.map((game) => (
          <Link key={game} to={`/games/${game}/create`}>
            <Button
              variant="outline"
              className="h-full text-xl capitalize"
              onClick={() => setState({ navDirection: 'right' })}
            >
              {game}
            </Button>
          </Link>
        ))}
      </div>
    </BasicPage>
  );
};

export default Menu;
