import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { useGamesState } from '@/lib/state';
import { cn, goToUrlSubpath, swapLastUrlSubpath } from '@/lib/utils';

interface BackButtonProps {
  back?: 'menu' | 'create' | 'play';
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ back, className }) => {
  const destination =
    back === 'create'
      ? swapLastUrlSubpath(useLocation().pathname, '/create')
      : back === 'play'
        ? swapLastUrlSubpath(useLocation().pathname, '/play')
        : goToUrlSubpath(useLocation().pathname, 2);
  const { setState } = useGamesState();

  return (
    <Link
      to={destination}
      className={cn(
        'relative flex h-full w-fit cursor-pointer flex-row items-center rounded-full pr-2 hover:bg-secondary',
        className,
      )}
      onClick={() => {
        setState({ navDirection: 'left' });
      }}
    >
      <ChevronLeft className="h-1/2 stroke-foreground" />
      <Label className="cursor-pointer text-[2svh] leading-none">Back</Label>
    </Link>
  );
};

export default BackButton;
