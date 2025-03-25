import { Link } from 'react-router-dom';
import React from 'react';
import { Button } from '@/components/ui/button';
import ThemeButton from '@/components/menu/ThemeButton';
import { Label } from '@/components/ui/label';
import AnimatedPage from './AnimatedPage';

const Menu: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="flex flex-col h-svh items-center bg-background">
        <div className="flex flex-col items-center justify-evenly h-screen py-8">
          <Label className="text-2xl">Games by Jaleel</Label>
          <div className="flex gap-5 justify-evenly w-full">
            <Button asChild variant="ghost" className="hover:bg-secondary">
              <Link to="./sudoku">Sudoku</Link>
            </Button>
            <Button asChild variant="ghost" className="hover:bg-secondary">
              <Link to="./sudoku">Sudoku</Link>
            </Button>
            <Button asChild variant="ghost" className="hover:bg-secondary">
              <Link to="./sudoku">Sudoku</Link>
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
