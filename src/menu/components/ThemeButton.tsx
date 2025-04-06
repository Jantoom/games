import { DialogDescription } from '@radix-ui/react-dialog';
import { Palette } from 'lucide-react';
import React, { useState } from 'react';
import ControlButton from '@/components/ControlButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Themes } from '@/lib/styles';
import { useGlobalState } from '../globalState';

const ThemeButton: React.FC = () => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { theme, setTheme } = useGlobalState();

  return (
    <Dialog open={isThemeOpen} onOpenChange={setIsThemeOpen}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isThemeOpen}
          Icon={Palette}
          onClick={() => setIsThemeOpen(true)}
        />
      </DialogTrigger>
      <DialogContent
        className="max-w-[90%] border-border [&>button:last-child]:hidden"
        aria-description="theme button"
      >
        <DialogHeader>
          <DialogTitle className="text-center">Themes</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {Object.keys(Themes).map((t) => (
          <DialogClose asChild key={t}>
            <Button
              onClick={() => setTheme(t)}
              variant="outline"
              className={`w-full border border-border ${theme === t ? 'bg-primary text-background' : ''} hover:bg-secondary`}
            >
              {t
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Button>
          </DialogClose>
        ))}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full border border-border hover:bg-secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeButton;
