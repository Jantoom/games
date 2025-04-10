import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
  cleanup: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ className, cleanup }) => {
  return (
    <Link
      to={useLocation().pathname.split('/').slice(0, -1).join('/')}
      className={cn(
        'relative flex h-full w-fit cursor-pointer flex-row items-center rounded-full pr-2 hover:bg-secondary',
        className,
      )}
      onClick={cleanup}
    >
      <ChevronLeft className="h-1/2 stroke-foreground" />
      <Label className="cursor-pointer text-[2svh] leading-none">Back</Label>
    </Link>
  );
};

export default BackButton;
