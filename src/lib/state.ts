import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Themes } from '@/lib/styles';
import { createDefaultJSONStorage } from './utils';

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

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      navDirection: undefined,
      theme: Object.keys(Themes)[0],
      setTheme: (theme: string) => {
        if (theme in Themes) {
          for (const [colorAlias, hexCode] of Object.entries(Themes[theme])) {
            document.documentElement.style.setProperty(
              `--${colorAlias}`,
              hexCode,
            );
          }
        }
        set({ theme: theme });
      },
      setState: (newState) => set(newState),
    }),
    {
      name: 'jantoom-games-global',
      storage: createDefaultJSONStorage(),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['setState', 'setTheme'].includes(key),
          ),
        ),
    },
  ),
);
