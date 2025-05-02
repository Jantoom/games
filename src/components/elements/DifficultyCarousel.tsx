import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel';

interface DifficultyCarouselProps<T extends string> {
  className?: string;
  difficulties: T[];
  difficulty: T;
  setDifficulty: React.Dispatch<React.SetStateAction<T>>;
}

const DifficultyCarousel = <T extends string>({
  className,
  difficulties,
  difficulty,
  setDifficulty,
}: DifficultyCarouselProps<T>) => {
  const [api, setApi] = useState<CarouselApi>();
  const [isInitialised, setIsInitialised] = useState(false);
  const [hide, setHide] = useState(undefined);

  const checkHiddenButtons = useCallback(
    (index: number) => {
      if (index === 0) {
        setHide('prev');
      } else if (index === difficulties.length - 1) {
        setHide('next');
      } else {
        setHide(undefined);
      }
    },
    [difficulties],
  );

  useEffect(() => {
    if (!api) return;
    if (!isInitialised) {
      const index = difficulties.indexOf(difficulty);
      checkHiddenButtons(index);
      api.scrollTo(index, true);

      api.on('select', () => {
        const index = api.selectedScrollSnap();
        checkHiddenButtons(index);
        setDifficulty(difficulties[index]);
      });
      setIsInitialised(true);
    }
  }, [
    api,
    isInitialised,
    difficulty,
    difficulties,
    setDifficulty,
    checkHiddenButtons,
  ]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: false,
      }}
      className={cn('flex w-full min-w-32 flex-row items-center', className)}
    >
      <Button
        variant="ghost"
        className={`h-12 w-8 p-0 ${hide === 'prev' ? 'opacity-0' : ''}`}
        onClick={() => api.scrollPrev()}
      >
        <ChevronLeft />
      </Button>
      <CarouselContent>
        {difficulties.map((diff, index) => (
          <CarouselItem key={index}>
            <Button
              variant="ghost"
              className="pb-2 text-center text-base"
              onClick={() => setDifficulty(diff)}
            >
              {diff[0].toUpperCase() + diff.slice(1)}
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <Button
        variant="ghost"
        className={`h-12 w-8 p-0 ${hide === 'next' ? 'opacity-0' : ''}`}
        onClick={() => api.scrollNext()}
      >
        <ChevronRight />
      </Button>
    </Carousel>
  );
};

export default DifficultyCarousel;
