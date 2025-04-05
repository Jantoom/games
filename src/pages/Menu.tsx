import React from 'react';
import { Link } from 'react-router-dom';
import ThemeButton from '@/components/menu/ThemeButton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AnimatedPage from './AnimatedPage';

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
              <Link to="./sudoku">Sudoku</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="./minesweeper">Minesweeper</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="./solitaire">Solitaire</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="./snake">Snake</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="./pong">Pong</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="text-xl hover:bg-secondary"
            >
              <Link to="./2048">2048</Link>
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
