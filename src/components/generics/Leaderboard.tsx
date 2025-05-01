import { Trash, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
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
import DifficultyCarousel from '../elements/DifficultyCarousel';
import { motion, AnimatePresence } from 'framer-motion';

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
        <DialogClose asChild>
          <Button variant="outline" className="rounded-full">
            Got it!
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

interface LeaderboardSelectorProps<T extends string> {
  difficulties: T[];
  difficulty: T;
  setDifficulty: React.Dispatch<React.SetStateAction<T>>;
  className?: string;
  children: React.ReactNode;
}
const LeaderboardSelector = <T extends string>({
  difficulties,
  difficulty,
  setDifficulty,
  className,
  children,
}: LeaderboardSelectorProps<T>) => {
  return (
    <>
      <DifficultyCarousel
        difficulties={[...difficulties]}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${difficulty}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: 'easeInOut' }}
          className={cn('h-96 max-h-[80svh] w-full', className)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

interface LeaderboardTableProps {
  className?: string;
  children: React.ReactNode;
}
const LeaderboardTable = ({ className, children }: LeaderboardTableProps) => {
  return (
    <Table className={cn('border-separate border-spacing-0', className)}>
      {children}
    </Table>
  );
};

interface LeaderboardTableHeaderProps {
  headers: string[];
  allowDeletion?: boolean;
}
const LeaderboardTableHeader = ({
  headers,
  allowDeletion = true,
}: LeaderboardTableHeaderProps) => {
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
        {allowDeletion && (
          <TableHead className="border-b border-border px-0"></TableHead>
        )}
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
  allowDeletion?: boolean;
}
const LeaderboardTableRow = <T extends { leaderboard: any[] }>({
  index,
  setState,
  data,
  isCurrent,
  allowDeletion = true,
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
      className={`h-10 text-sm font-medium ${isCurrent ? 'text-primary' : ''}`}
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
      {allowDeletion && (
        <LeaderboardTableCell className="text-end">
          <ControlButton
            Icon={Trash}
            onClick={() => deleteEntry(index)}
            isSelected={false}
            className="aspect-auto h-8 p-0"
          />
        </LeaderboardTableCell>
      )}
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
  LeaderboardSelector,
  LeaderboardTable,
  LeaderboardTableHeader,
  LeaderboardTableBody,
  LeaderboardTableRow,
  LeaderboardTableCell,
};
