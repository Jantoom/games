import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalState } from '@/lib/state';
import { cn, goToUrlSubpath, swapLastUrlSubpath } from '@/lib/utils';

interface BackButtonProps {
  back?: 'menu' | 'create' | 'play';
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ back, className }) => {
  const pathname = useLocation().pathname;
  const destination =
    back === 'create'
      ? swapLastUrlSubpath(pathname, '/create')
      : back === 'play'
        ? swapLastUrlSubpath(pathname, '/play')
        : goToUrlSubpath(pathname, 2);
  const { setState } = useGlobalState();

  return (
    <Link
      to={destination}
      className={cn(
        'relative flex h-full w-fit cursor-pointer flex-row items-center rounded-full px-4 hover:bg-secondary',
        className,
      )}
      onClick={() => {
        setState({ navDirection: 'left' });
      }}
    >
      <ArrowLeft className="h-1/2 stroke-foreground" />
    </Link>
  );
};

export default BackButton;
