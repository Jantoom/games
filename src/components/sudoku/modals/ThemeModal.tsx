
import { Button } from "@/components/ui/button";
import { Themes } from "@/lib/theme";

interface ThemeModalProps {
  onClose: () => void;
  onSelectTheme: (theme: string) => void;
  currentTheme: string;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ onClose, onSelectTheme, currentTheme }) => (
  <>
    <h3 className="text-lg font-semibold text-center mb-4 text-foreground">Select Theme</h3>
    <div className="space-y-2">
      {(Object.keys(Themes)).map(t => (
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
