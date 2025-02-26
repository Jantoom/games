
import { Button } from "@/components/ui/button";
import { Theme } from "../types";

interface ThemeModalProps {
  onClose: () => void;
  onSelectTheme: (theme: Theme) => void;
  currentTheme: Theme;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ onClose, onSelectTheme, currentTheme }) => (
  <>
    <h3 className="text-lg font-semibold text-center mb-4 text-foreground">Select Theme</h3>
    <div className="space-y-2">
      {(['dark-blue', 'light-blue', 'dark-red', 'light-red'] as Theme[]).map(t => (
        <Button
          key={t}
          onClick={() => onSelectTheme(t)}
          variant="outline"
          className={`w-full border-border ${currentTheme === t ? 'bg-primary text-background' : ''} hover:bg-secondary`}
        >
          {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Button>
      ))}
    </div>
    <Button onClick={onClose} variant="outline" className="w-full hover:bg-secondary">
      Close
    </Button>
  </>
);
