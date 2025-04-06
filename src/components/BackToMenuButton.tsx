import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const BackToMenuButton: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/games"
            className="flex aspect-square h-full items-center justify-center justify-self-start rounded-full hover:bg-secondary"
          >
            <ChevronLeft size={'24'} />
          </Link>
        </TooltipTrigger>
        <TooltipContent className='border-secondary bg-background'>
          <span className="text-base">Back to menu...</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BackToMenuButton;
