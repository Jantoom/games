import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/containers/AnimatedPage';
import ThemeButton from '../components/elements/ThemeButton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const Menu: React.FC = () => {
  return (
    <AnimatedPage depth={0}>
      <div className="flex h-svh flex-col items-center justify-evenly">
        <Label className="text-center text-3xl">Games by Jaleel</Label>
        <div className="flex w-full flex-col justify-evenly">
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link to="/games/sudoku">Sudoku</Link>
          </Button>
          <Separator className="my-1" />
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link to="/games/minesweeper">Minesweeper</Link>
          </Button>
          <Separator className="my-1" />
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link to="/games/solitaire">Solitaire</Link>
          </Button>
          <Separator className="my-1" />
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link to="/games/snake">Snake</Link>
          </Button>
          <Separator className="my-1" />
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link to="/games/pong">Pong</Link>
          </Button>
          <Separator className="my-1" />
          <Button
            asChild
            variant="ghost"
            className="text-xl hover:bg-secondary"
          >
            <Link to="/games/2048">2048</Link>
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
