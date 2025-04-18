import { create } from 'zustand';
import { Themes } from '@/lib/styles';
import { getGamesData, saveGameData } from './utils';

export type GlobalState = {
  theme: string | undefined;
  navDirection: 'left' | 'right' | undefined;
  setTheme: (theme: string) => void;
  setState: (
    newState:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void;
};

export const useGlobalState = create<GlobalState>((set) => {
  const state = getGamesData()['global'] as GlobalState;

  return {
    navDirection: state?.navDirection ?? undefined,
    theme: state?.theme ?? Object.keys(Themes)[0],
    setTheme: (theme: string) => {
      if (theme in Themes) {
        for (const [colorAlias, hexCode] of Object.entries(Themes[theme])) {
          document.documentElement.style.setProperty(
            `--${colorAlias}`,
            hexCode,
          );
        }
        saveGameData(getGamesData(), { global: { theme: theme } });
      }
      set({ theme: theme });
    },
    setState: (newState) => set(newState),
  };
});
