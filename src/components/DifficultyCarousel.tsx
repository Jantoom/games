import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

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
  const [api, setApi] = useState<CarouselApi>(undefined);

  useEffect(() => {
    if (!api) return;
    api.scrollTo(
      difficulties.findIndex((diff) => diff === difficulty),
      true,
    );

    api.on('select', () => {
      reset(difficulties[api.selectedScrollSnap()]);
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: true,
      }}
      className={cn('flex h-full min-w-32 flex-row items-center', className)}
    >
      <Button
        variant="ghost"
        className="h-12 aspect-square rounded-full p-0 hover:bg-secondary"
        onClick={() => api.scrollPrev()}
      >
        <ChevronLeft />
      </Button>
      <CarouselContent className="">
        {difficulties.map((diff, index) => (
          <CarouselItem>
            <Button
              key={index}
              variant='ghost'
              className="w-full rounded-full text-center text-base hover:bg-secondary pb-2"
              onClick={() => reset(diff)}
            >
              {diff[0].toUpperCase() + diff.slice(1)}
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <Button
        variant="ghost"
        className="h-12 aspect-square rounded-full p-0 hover:bg-secondary"
        onClick={() => api.scrollNext()}
      >
        <ChevronRight />
      </Button>
    </Carousel>
  );
};

export default DifficultyCarousel;
