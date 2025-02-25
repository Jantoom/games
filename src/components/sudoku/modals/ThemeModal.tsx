
import { Button } from "@/components/ui/button";
import { Theme } from "../types";

interface ThemeModalProps {
  onClose: () => void;
  onSelectTheme: (theme: Theme) => void;
  currentTheme: Theme;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ onClose, onSelectTheme, currentTheme }) => (
  <>
    <h3 className="text-lg font-semibold text-center mb-4 text-color-2">Select Theme</h3>
    <div className="space-y-2">
      {(['dark-blue', 'light-blue', 'dark-red', 'light-red'] as Theme[]).map(t => (
        <Button
          key={t}
          onClick={() => onSelectTheme(t)}
          variant="outline"
          className={`w-full border-color-3 text-color-2 ${currentTheme === t ? 'bg-color-5 text-color-1' : 'hover:bg-color-4'}`}
        >
          {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Button>
      ))}
    </div>
    <Button onClick={onClose} variant="outline" className="w-full border-color-3 text-color-2 hover:bg-color-4">
      Close
    </Button>
  </>
);
