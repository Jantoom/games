import { Palette } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Themes } from '@/lib/styles';
import { useGlobalStore } from '../../lib/state';
import DialogButton from '../generics/DialogButton';
import { SettingsSwitch } from '../generics/Settings';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const ThemeButton: React.FC = () => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { mode, theme, changeTheme, setState } = useGlobalStore();

  useEffect(() => {
    changeTheme(mode, theme);
  }, [mode, theme]);

  return (
    <DialogButton
      Icon={Palette}
      title="Theme"
      isOpen={isThemeOpen}
      setIsOpen={setIsThemeOpen}
    >
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        <div className="flex w-[65%] items-center justify-between">
          <SettingsSwitch
            name="Dark mode"
            active={mode === 'dark'}
            change={() =>
              setState((prev) => ({
                mode: prev.mode === 'dark' ? 'light' : 'dark',
              }))
            }
          />
        </div>
        <Select
          defaultValue={theme}
          onValueChange={(t) => setState({ theme: t })}
        >
          <SelectTrigger className="w-[70%] rounded-full border-accent px-4 capitalize">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent
            className="m-0 rounded-3xl border-accent bg-background p-0"
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            <SelectGroup>
              {Object.keys(Themes.dark).map((t, index) => (
                <SelectItem
                  key={index}
                  value={t}
                  className="rounded-full bg-background capitalize"
                >
                  {t}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </DialogButton>
  );
};

export default ThemeButton;
