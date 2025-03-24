
import { Button } from "@/components/ui/button";
import { Themes } from "@/lib/styles";

interface ThemeModalProps {
  currentTheme: string;
  isThemeOpen: boolean;
  onSelectTheme: (theme: string) => void;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  currentTheme,
  isThemeOpen,
  onSelectTheme,
  onClose,
}) => (
  <div onClick={(e) => e.stopPropagation()} className={`absolute w-full border border-border bg-background p-6 rounded-lg space-y-4 transition duration-300 ease-in-out ${isThemeOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <h3 className="text-lg font-semibold text-center mb-4 text-foreground">Select Theme</h3>
    <div className="space-y-2">
      {(Object.keys(Themes)).map(t => (
        <Button
          key={t}
          onClick={() => { onSelectTheme(t); onClose(); }}
          variant="outline"
          className={`w-full border border-border ${currentTheme === t ? 'bg-primary text-background' : ''} hover:bg-secondary`}
        >
          {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Button>
      ))}
    </div>
    <Button onClick={onClose} variant="outline" className="w-full hover:bg-secondary">
      Close
    </Button>
  </div>
);
