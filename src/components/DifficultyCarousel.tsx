import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';

interface DifficultyCarouselProps<T extends string> {
  className?: string;
  difficulty: T;
  difficulties: T[];
  reset: (difficulty: T) => void;
}

const DifficultyCarousel = <T extends string>({
  className,
  difficulty,
  difficulties,
  reset,
}: DifficultyCarouselProps<T>) => {
  const [api, setApi] = useState<CarouselApi>();
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    if (!api) return;
    if (!isInitialised) {
      api.scrollTo(difficulties.indexOf(difficulty), true);

      api.on('select', () => {
        reset(difficulties[api.selectedScrollSnap()]);
      });
      setIsInitialised(true);
    }
  }, [api, isInitialised, difficulty, difficulties, reset]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: true,
      }}
      className={cn('flex min-w-32 flex-row items-center', className)}
    >
      <Button
        variant="ghost"
        className="h-12 w-8 rounded-full p-0 hover:bg-secondary"
        onClick={() => api.scrollPrev()}
      >
        <ChevronLeft />
      </Button>
      <CarouselContent className="">
        {difficulties.map((diff, index) => (
          <CarouselItem key={index}>
            <Button
              variant="ghost"
              className="w-full rounded-full pb-2 text-center text-base hover:bg-secondary"
              onClick={() => reset(diff)}
            >
              {diff[0].toUpperCase() + diff.slice(1)}
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <Button
        variant="ghost"
        className="h-12 w-8 rounded-full p-0 hover:bg-secondary"
        onClick={() => api.scrollNext()}
      >
        <ChevronRight />
      </Button>
    </Carousel>
  );
};

export default DifficultyCarousel;
