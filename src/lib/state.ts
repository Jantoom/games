import { create } from 'zustand';
import { Themes } from '@/lib/styles';

export type GamesState = {
  navDirection: 'left' | 'right';
  theme: string;
  setTheme: (theme: string) => void;
  setState: (
    newState:
      | Partial<GamesState>
      | ((state: GamesState) => Partial<GamesState>),
  ) => void;
};

export const useGamesState = create<GamesState>((set) => ({
  navDirection: undefined,
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
  setState: (newState) => set(newState),
}));
