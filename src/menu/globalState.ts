import { create } from 'zustand';
import { Themes } from '@/lib/styles';

export type GlobalState = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useGlobalState = create<GlobalState>((set) => ({
  theme: localStorage.getItem('theme') ?? Object.keys(Themes)[0],
  setTheme: (theme: string) => {
    if (theme in Themes) {
      for (const [colorAlias, hexCode] of Object.entries(Themes[theme])) {
        document.documentElement.style.setProperty(`--${colorAlias}`, hexCode);
      }
      localStorage.setItem('theme', theme);
    }
    set({ theme: theme });
  },
}));
