import { Themes } from '@/lib/styles';
import { create } from 'zustand';

interface GlobalState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useGlobalState = create<GlobalState>((set) => ({
  theme: localStorage.getItem('theme'),
  setTheme: (theme) => {
    if (theme in Themes) {
      for (const [colorAlias, hexCode] of Object.entries(Themes[theme])) {
        document.documentElement.style.setProperty(`--${colorAlias}`, hexCode);
      }
      localStorage.setItem('theme', theme);
    }
    set({ theme: theme });
  },
}));
