import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ThemeButton from './components/ThemeButton';

const Menu: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="flex h-svh flex-col items-center bg-background">
        <div className="flex h-screen w-1/2 flex-col items-center justify-evenly py-8">
          <Label className="text-center text-3xl">Games by Jaleel</Label>
          <div className="flex w-full flex-col justify-evenly gap-5">
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="/games/sudoku">Sudoku</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="/games/minesweeper">Minesweeper</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="/games/solitaire">Solitaire</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="/games/snake">Snake</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="/games/pong">Pong</Link>
            </Button>
            <Separator className="-my-4" />
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
      </div>
    </AnimatedPage>
  );
};

export default Menu;
