import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

const BackToMenuButton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/games"
            className={cn(
              'flex w-fit cursor-pointer flex-row items-center gap-2 rounded-full hover:bg-secondary px-1 py-1',
              className,
            )}
          >
            <ChevronLeft size={'24'} />
            <Label className="cursor-pointer pr-2 text-foreground">Back</Label>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="border-secondary bg-background">
          <Label>Back to menu...</Label>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BackToMenuButton;
