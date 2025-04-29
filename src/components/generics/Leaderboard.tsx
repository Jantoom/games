import { ChevronLeft, ChevronRight, Trash, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { cn } from '@/lib/utils';
import { GamesData } from '@/lib/types';
import DialogButton from './DialogButton';
import ControlButton from './ControlButton';

interface LeaderboardButtonProps {
  leaderboard: React.ReactNode;
}
const LeaderboardButton: React.FC<LeaderboardButtonProps> = ({
  leaderboard,
}) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  return (
    <DialogButton
      Icon={Trophy}
      title="Leaderboard"
      isOpen={isLeaderboardOpen}
      setIsOpen={setIsLeaderboardOpen}
    >
      {leaderboard}
    </DialogButton>
  );
};

interface LeaderboardDialogProps {
  delay?: boolean;
  children: React.ReactNode;
}
const LeaderboardDialog = ({ delay, children }: LeaderboardDialogProps) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(!delay);

  useEffect(() => {
    if (delay) {
      setTimeout(() => {
        setIsLeaderboardOpen(true);
      }, 1000);
    }
  }, []);

  return (
    <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
      <DialogContent>
        <DialogTitle className="text-center">Leaderboard</DialogTitle>
        <DialogDescription className="hidden" />
        {children}
      </DialogContent>
    </Dialog>
  );
};

interface LeaderboardCarouselProps<T extends string> {
  difficulty: T;
  difficulties: T[];
  children: React.ReactNode;
}
const LeaderboardCarousel = <T extends string>({
  difficulty,
  difficulties,
  children,
}: LeaderboardCarouselProps<T>) => {
  const [api, setApi] = useState<CarouselApi>();
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    if (api && !isInitialised) {
      api.scrollTo(difficulties.indexOf(difficulty), true);
      setIsInitialised(true);
    }
  }, [api, isInitialised, difficulty, difficulties]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="relative h-full w-full min-w-32"
    >
      <Button
        variant="ghost"
        className="absolute left-0 top-0 z-10 aspect-square h-12 rounded-full p-0"
        onClick={() => api.scrollPrev()}
      >
        <ChevronLeft />
      </Button>
      <CarouselContent className="h-full">{children}</CarouselContent>
      <Button
        variant="ghost"
        className="absolute right-0 top-0 z-10 aspect-square h-12 rounded-full p-0"
        onClick={() => api.scrollNext()}
      >
        <ChevronRight />
      </Button>
    </Carousel>
  );
};

interface LeaderboardCarouselItemProps<T extends string> {
  difficulty: T;
  children: React.ReactNode;
}
const LeaderboardCarouselItem = <T extends string>({
  difficulty,
  children,
}: LeaderboardCarouselItemProps<T>) => {
  return (
    <CarouselItem>
      <div className="flex flex-col space-y-1">
        <span className="flex h-12 w-full items-center justify-center font-medium capitalize leading-none">
          {difficulty}
        </span>
        <div
          className="scrollbar-none relative max-h-96 min-h-48 touch-pan-y overflow-auto"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {children}
        </div>
      </div>
    </CarouselItem>
  );
};

interface LeaderboardTableProps {
  children: React.ReactNode;
}
const LeaderboardTable = ({ children }: LeaderboardTableProps) => {
  return <Table className="border-separate border-spacing-0">{children}</Table>;
};

interface LeaderboardTableHeaderProps {
  headers: string[];
}
const LeaderboardTableHeader = ({ headers }: LeaderboardTableHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 w-full bg-background">
      <TableRow>
        {headers.map((header, index) => (
          <TableHead
            key={index}
            className={`border-b border-border px-0 text-base ${index === 0 ? 'text-start' : index === headers.length - 1 ? 'text-end' : 'text-center'}`}
          >
            {header}
          </TableHead>
        ))}
        <TableHead className="border-b border-border px-0"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

interface LeaderboardTableBodyProps {
  children: React.ReactNode;
}
const LeaderboardTableBody = ({ children }: LeaderboardTableBodyProps) => {
  return <TableBody>{children}</TableBody>;
};

interface LeaderboardTableRowProps<T extends { leaderboard: any[] }> {
  index: number;
  game: keyof GamesData;
  setState: (state: (prev: T) => { leaderboard: any[] }) => void;
  data: any[];
  isCurrent: boolean;
}
const LeaderboardTableRow = <T extends { leaderboard: any[] }>({
  index,
  setState,
  data,
  isCurrent,
}: LeaderboardTableRowProps<T>) => {
  const deleteEntry = (index: number): void => {
    setState((prev) => {
      const newLeaderboard = prev.leaderboard.filter(
        (_, index_) => index_ !== index,
      );
      return { leaderboard: newLeaderboard };
    });
  };

  return (
    <TableRow
      className={`text-sm font-medium ${isCurrent ? 'text-primary' : ''}`}
    >
      {data.map((item, index) => (
        <LeaderboardTableCell
          key={index}
          className={`m-0 text-base ${
            index === 0
              ? 'text-start'
              : index === data.length - 1
                ? 'text-end'
                : 'text-center'
          }`}
        >
          {item}
        </LeaderboardTableCell>
      ))}
      <LeaderboardTableCell className="text-end">
        <ControlButton
          Icon={Trash}
          onClick={() => deleteEntry(index)}
          isSelected={false}
          className="aspect-auto h-8 p-0"
        />
      </LeaderboardTableCell>
    </TableRow>
  );
};

interface LeaderboardTableCellProps {
  className?: string;
  children: React.ReactNode;
}
const LeaderboardTableCell = ({
  className,
  children,
}: LeaderboardTableCellProps) => {
  return (
    <TableCell className={cn('px-0 py-1', className)}>{children}</TableCell>
  );
};

export {
  LeaderboardButton,
  LeaderboardDialog,
  LeaderboardCarousel,
  LeaderboardCarouselItem,
  LeaderboardTable,
  LeaderboardTableHeader,
  LeaderboardTableBody,
  LeaderboardTableRow,
  LeaderboardTableCell,
};
