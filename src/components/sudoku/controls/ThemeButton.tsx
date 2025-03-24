
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Themes } from "@/lib/styles";
import { Palette } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ControlButton } from "./ControlButton";

export const ThemeButton: React.FC = () => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light-blue');

  const updateThemeColors = useCallback(() => {
    if (theme in Themes) {
      for (const [colorAlias, hexCode] of Object.entries(Themes[theme])) {
        document.documentElement.style.setProperty(`--${colorAlias}`, hexCode);
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    updateThemeColors();
  }, [updateThemeColors]);

  useEffect(() => {
    updateThemeColors();
  }, [theme, updateThemeColors]);

  const onClose = () => setIsThemeOpen(false);
  const onSetTheme = (theme) => {
    setTheme(theme);
    onClose();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ControlButton isSelected={isThemeOpen} Icon={Palette} onClick={() => setIsThemeOpen(true)} />
      </DialogTrigger>
      <DialogContent className="border-border [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Themes</DialogTitle>
        </DialogHeader>
        {(Object.keys(Themes)).map(t => (
          <DialogClose asChild key={t}>
            <Button
              onClick={() => onSetTheme(t)}
              variant="outline"
              className={`w-full border border-border ${theme === t ? 'bg-primary text-background' : ''} hover:bg-secondary`}
            >
              {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Button>
          </DialogClose>
      ))}
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClose} variant="outline" className="w-full border border-border hover:bg-secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
};