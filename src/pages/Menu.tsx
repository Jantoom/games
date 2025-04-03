import { Link } from 'react-router-dom';
import React from 'react';
import { Button } from '@/components/ui/button';
import ThemeButton from '@/components/menu/ThemeButton';
import { Label } from '@/components/ui/label';
import AnimatedPage from './AnimatedPage';
import { Separator } from '@/components/ui/separator';

const Menu: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="flex flex-col h-svh items-center bg-background">
        <div className="flex flex-col items-center justify-evenly h-screen w-1/2 py-8">
          <Label className="text-3xl text-center">Games by Jaleel</Label>
          <div className="flex flex-col gap-5 justify-evenly w-full">
            <Button
              asChild
              variant="ghost"
              className="hover:bg-secondary text-xl"
            >
              <Link to="./sudoku">Sudoku</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="hover:bg-secondary text-xl"
            >
              <Link to="./minesweeper">Minesweeper</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="hover:bg-secondary text-xl"
            >
              <Link to="./solitaire">Solitaire</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="hover:bg-secondary text-xl"
            >
              <Link to="./snake">Snake</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="hover:bg-secondary text-xl"
            >
              <Link to="./pong">Pong</Link>
            </Button>
            <Separator className="-my-4" />
            <Button
              asChild
              variant="ghost"
              className="hover:bg-secondary text-xl"
            >
              <Link to="./2048">2048</Link>
            </Button>
          </div>
          <div className="flex justify-evenly w-full">
            <ThemeButton />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Menu;
