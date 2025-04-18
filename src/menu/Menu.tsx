import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGlobalState } from '@/lib/state';
import { PageDepth } from '@/lib/types';
import AnimatedPage from '../components/containers/AnimatedPage';
import ThemeButton from '../components/elements/ThemeButton';

const Menu: React.FC = () => {
  const { setState } = useGlobalState();
  return (
    <AnimatedPage pageDepth={PageDepth.Menu}>
      <div className="flex h-svh flex-col items-center justify-evenly">
        <Label className="text-center text-3xl">Games by Jaleel</Label>
        <div className="flex w-full flex-col justify-evenly">
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link
              to="/games/sudoku/create"
              onClick={() => setState({ navDirection: 'right' })}
            >
              Sudoku
            </Link>
          </Button>
          <Separator className="my-1" />
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link
              to="/games/minesweeper/create"
              onClick={() => setState({ navDirection: 'right' })}
            >
              Minesweeper
            </Link>
          </Button>
          <Separator className="my-1" />
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
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
            variant="ghost"
            className="text-xl hover:bg-secondary"
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
            variant="ghost"
            className="text-xl hover:bg-secondary"
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
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link
              to="/games/2048/create"
              onClick={() => setState({ navDirection: 'right' })}
            >
              2048
            </Link>
          </Button>
        </div>
        <div className="flex w-full justify-evenly">
          <ThemeButton />
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Menu;
