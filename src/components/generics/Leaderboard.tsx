import { Trash, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '../ui/label';

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
      <DialogContent className="gap-y-2">
        <DialogTitle className="text-center">Leaderboard</DialogTitle>
        <DialogDescription className="hidden" />
        {children}
        <DialogClose asChild>
          <Button variant="outline">Got it!</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

interface LeaderboardAssistsProps {
  usedAssists: boolean[];
  setUsedAssists: React.Dispatch<React.SetStateAction<boolean[]>>;
}
const LeaderboardAssists = ({
  usedAssists,
  setUsedAssists,
}: LeaderboardAssistsProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-y-2">
      <Label className="text-xs">Assists</Label>
      <div className="flex w-full items-center justify-center gap-2">
        {usedAssists.map((usedAssist, index) => (
          <Button
            key={index}
            variant={usedAssist ? 'default' : 'outline'}
            className="h-4 w-4 p-0 transition-colors duration-300 ease-in-out"
            onClick={() => {
              setUsedAssists(
                usedAssists.map((usedAssist, oldIndex) =>
                  index === oldIndex ? !usedAssist : usedAssist,
                ),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface LeaderboardHintsProps {
  usedHints: boolean;
  setUsedHints: React.Dispatch<React.SetStateAction<boolean>>;
}
const LeaderboardHints = ({
  usedHints,
  setUsedHints,
}: LeaderboardHintsProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-y-2">
      <Label className="text-xs">Hints used</Label>
      <Button
        variant={usedHints ? 'default' : 'outline'}
        className="h-4 w-4 p-0 transition-colors duration-300 ease-in-out"
        onClick={() => setUsedHints(!usedHints)}
      />
    </div>
  );
};

interface LeaderboardTableProps {
  tableKey: string;
  headers?: string[];
  allowDeletion?: boolean;
  className?: string;
  children: React.ReactNode;
}
const LeaderboardTable = ({
  tableKey,
  headers,
  allowDeletion = true,
  className,
  children,
}: LeaderboardTableProps) => {
  const hasVisibleChildren = React.Children.toArray(children).some(Boolean);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tableKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1, ease: 'easeInOut' }}
        className={cn(
          'flex h-80 max-h-[80svh] w-full flex-col items-center overflow-auto',
          className,
        )}
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {hasVisibleChildren ? (
          <Table className={cn('border-separate border-spacing-0', className)}>
            {headers && (
              <LeaderboardTableHeader
                headers={headers}
                allowDeletion={allowDeletion}
              />
            )}
            <LeaderboardTableBody>{children}</LeaderboardTableBody>
          </Table>
        ) : (
          <LeaderboardEmpty />
        )}
      </motion.div>
    </AnimatePresence>
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
      {data.map((item, i) => (
        <LeaderboardTableCell
          key={i}
          className={`m-0 text-base ${
            i === 0
              ? 'text-start'
              : i === data.length - 1
                ? 'text-end'
                : 'text-center'
          }`}
        >
          {i === 0 ? `${index + 1}. ` : ''}
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

interface LeaderboardEmptyProps {
  className?: string;
}
const LeaderboardEmpty = ({ className }: LeaderboardEmptyProps) => {
  return (
    <Label className={cn('py-2 text-center text-sm', className)}>
      No entries yet
    </Label>
  );
};

export {
  LeaderboardButton,
  LeaderboardDialog,
  LeaderboardAssists,
  LeaderboardHints,
  LeaderboardTable,
  LeaderboardTableHeader,
  LeaderboardTableBody,
  LeaderboardTableRow,
  LeaderboardTableCell,
  LeaderboardEmpty,
};
