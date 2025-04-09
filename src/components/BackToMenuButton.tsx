import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const BackToMenuButton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link
      to="/games"
      className={cn(
        'flex h-full cursor-pointer flex-row items-center rounded-full pr-4 hover:bg-secondary',
        className,
      )}
    >
      <ChevronLeft />
      <Label className="cursor-pointer">Back</Label>
    </Link>
  );
};

export default BackToMenuButton;
