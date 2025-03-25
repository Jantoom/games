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
import { Palette } from 'lucide-react';
import { useState } from 'react';
import ControlButton from '../ControlButton';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useGlobalState } from '@/states/globalState';

const ThemeButton: React.FC = () => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { theme, setTheme } = useGlobalState();
  const close = () => setIsThemeOpen(false);

  return (
    <Dialog onOpenChange={(isOpen) => (isOpen ? null : close())}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isThemeOpen}
          Icon={Palette}
          onClick={() => setIsThemeOpen(true)}
        />
      </DialogTrigger>
      <DialogContent
        className="border-border [&>button:last-child]:hidden max-w-[90%]"
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
