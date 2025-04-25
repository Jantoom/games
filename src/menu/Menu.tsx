import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGlobalState } from '@/lib/state';
import Page from '../components/containers/Page';
import ThemeButton from '../components/elements/ThemeButton';
import Body from '@/components/containers/Body';
import Header from '@/components/containers/Header';
import Footer from '@/components/containers/Footer';

const Menu: React.FC = () => {
  const { setState } = useGlobalState();
  return (
    <Page>
      <Header title="Games by Jaleel" />
      <Body variant="menu">
        <Button
          asChild
          variant="ghost"
          className="w-full text-xl hover:bg-secondary"
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
          className="w-full text-xl hover:bg-secondary"
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
          className="w-full text-xl hover:bg-secondary"
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
          className="w-full text-xl hover:bg-secondary"
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
          className="w-full text-xl hover:bg-secondary"
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
          className="w-full text-xl hover:bg-secondary"
        >
          <Link
            to="/games/2048/create"
            onClick={() => setState({ navDirection: 'right' })}
          >
            2048
          </Link>
        </Button>
      </Body>
      <Footer>
        <ThemeButton />
      </Footer>
    </Page>
  );
};

export default Menu;
