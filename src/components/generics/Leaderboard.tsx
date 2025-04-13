import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getGamesData, saveGameData } from '@/lib/utils';

interface LeaderboardProps<T extends string> {
  game: string;
  shouldOpen?: boolean;
  seed?: string;
  difficulty: T;
  difficulties: T[];
}

const Leaderboard = <
  T extends string,
  U extends {
    seed: string;
    difficulty: T;
    score: string;
    hints: boolean[];
    date: string;
  },
>({
  game,
  shouldOpen = false,
  seed = '',
  difficulty,
  difficulties,
}: LeaderboardProps<T>) => {
  const readLeaderboard = useCallback(
    (): U[] => (getGamesData()[game]?.leaderboard ?? []) as U[],
    [game],
  );

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<U[]>(readLeaderboard());
  const [api, setApi] = useState<CarouselApi>();
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    if (shouldOpen) {
      setTimeout(() => {
        setIsLeaderboardOpen(true);
      }, 1500);
    }
  }, [shouldOpen]);

  useEffect(() => {
    if (isLeaderboardOpen) setLeaderboard(readLeaderboard());
  }, [isLeaderboardOpen, readLeaderboard]);

  useEffect(() => {
    if (!api) return;
    if (!isInitialised) {
      api.scrollTo(difficulties.indexOf(difficulty), true);
      setIsInitialised(true);
    }
  }, [api, isInitialised, difficulty, difficulties]);

  const deleteEntry = (index: number): void =>
    setLeaderboard((prev) => {
      const gamesData = getGamesData();
      const newLeaderboard = prev.filter((_, index_) => index_ !== index);
      const newGameData = {
        [game]: { ...gamesData[game], leaderboard: newLeaderboard },
      };
      saveGameData(gamesData, newGameData);
      return newLeaderboard;
    });

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
        className="absolute left-0 top-0 z-10 aspect-square h-12 rounded-full p-0 hover:bg-secondary"
        onClick={() => api.scrollPrev()}
      >
        <ChevronLeft />
      </Button>
      <CarouselContent className="h-full">
        {difficulties.map((diff, index) => (
          <CarouselItem key={index}>
            <div className="flex flex-col space-y-1">
              <span className="flex h-12 w-full items-center justify-center font-medium capitalize leading-none">
                {diff}
              </span>
              <div
                className="scrollbar-none relative max-h-96 min-h-48 touch-pan-y overflow-auto"
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                <Table className="border-separate border-spacing-0">
                  <TableHeader className="sticky top-0 w-full bg-background">
                    <TableRow>
                      <TableHead className="border-b border-border px-0">
                        Score
                      </TableHead>
                      {leaderboard[0]?.hints !== undefined && (
                        <TableHead className="border-b border-border px-0 text-center">
                          Hints used
                        </TableHead>
                      )}
                      <TableHead className="border-b border-border px-0 text-center">
                        Date
                      </TableHead>
                      <TableHead className="border-b border-border px-0 text-end">
                        Delete
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard
                      .filter((entry) => entry.difficulty === diff)
                      .map((entry, index) => {
                        const isCurrent = seed === entry.seed;
                        return (
                          <TableRow
                            key={index}
                            className={`text-sm font-medium ${isCurrent ? 'text-primary' : ''}`}
                          >
                            <TableCell className="px-0">
                              {entry.score}
                            </TableCell>
                            {entry.hints !== undefined && (
                              <TableCell className="px-0 text-center">
                                {typeof entry.hints === 'number' ? (
                                  entry.hints
                                ) : (
                                  <div className="flex w-full items-center justify-center gap-2">
                                    {entry.hints?.map((used, index) => (
                                      <div
                                        key={index}
                                        className={`h-4 w-4 rounded-full ${used ? (isCurrent ? 'bg-primary' : 'bg-foreground') : isCurrent ? 'border border-primary' : 'border border-foreground'}`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </TableCell>
                            )}
                            <TableCell className="px-0 text-center">
                              {new Date(entry.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="px-0 text-end">
                              <Button
                                variant="ghost"
                                onClick={() => deleteEntry(index)}
                                className="rounded-full px-0 hover:bg-secondary"
                              >
                                <Trash />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <Button
        variant="ghost"
        className="absolute right-0 top-0 z-10 aspect-square h-12 rounded-full p-0 hover:bg-secondary"
        onClick={() => api.scrollNext()}
      >
        <ChevronRight />
      </Button>
    </Carousel>
  );
};

export default Leaderboard;
