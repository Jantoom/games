import { Palette } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Themes } from '@/lib/styles';
import { useGlobalStore } from '../../lib/state';
import DialogButton from '../generics/DialogButton';

const ThemeButton: React.FC = () => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { theme, setTheme } = useGlobalStore();

  return (
    <DialogButton
      Icon={Palette}
      title="Theme"
      isOpen={isThemeOpen}
      setIsOpen={setIsThemeOpen}
    >
      {Object.keys(Themes).map((t) => (
        <DialogClose asChild key={t}>
          <Button
            onClick={() => setTheme(t)}
            variant={theme === t ? 'default' : 'outline'}
            className="rounded-full"
          >
            {t
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Button>
        </DialogClose>
      ))}
    </DialogButton>
  );
};

export default ThemeButton;
