import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/lib/state';
import BasicPage from '@/components/containers/BasicPage';

const Menu: React.FC = () => {
  const { setState } = useGlobalStore();
  return (
    <BasicPage>
      <div className="flex w-full flex-col gap-y-4">
        <Button asChild variant="outline" className="text-xl">
          <Link
            to="/games/sudoku/create"
            onClick={() => setState({ navDirection: 'right' })}
          >
            Sudoku
          </Link>
        </Button>
        <Button asChild variant="outline" className="text-xl">
          <Link
            to="/games/minesweeper/create"
            onClick={() => setState({ navDirection: 'right' })}
          >
            Minesweeper
          </Link>
        </Button>
        {/* <Separator className="my-1" />
        <Button
          asChild
          variant="outline"
          className="text-xl"
        >
          <Link
            to="/games/solitaire/create"
            onClick={() => setState({ navDirection: 'right' })}
          >
            Solitaire
          </Link>
        </Button>
        <Separator className="my-1" />
        <Button
          asChild
          variant="outline"
          className="text-xl"
        >
          <Link
            to="/games/snake/create"
            onClick={() => setState({ navDirection: 'right' })}
          >
            Snake
          </Link>
        </Button>
        <Separator className="my-1" />
        <Button
          asChild
          variant="outline"
          className="text-xl"
        >
          <Link
            to="/games/pong/create"
            onClick={() => setState({ navDirection: 'right' })}
          >
            Pong
          </Link>
        </Button>
        <Separator className="my-1" />
        <Button
          asChild
          variant="outline"
          className="text-xl"
        >
          <Link
            to="/games/2048/create"
            onClick={() => setState({ navDirection: 'right' })}
          >
            2048
          </Link>
        </Button> */}
      </div>
    </BasicPage>
  );
};

export default Menu;
