import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Themes } from '@/lib/styles';
import { createDefaultJSONStorage } from './utils';

export type GlobalState = {
  mode: 'dark' | 'light' | undefined;
  theme: string | undefined;
  navDirection: 'left' | 'right' | undefined;
  changeTheme: (mode: 'dark' | 'light', theme: string) => void;
  setState: (
    newState:
      | Partial<GlobalState>
      | ((state: GlobalState) => Partial<GlobalState>),
  ) => void;
};

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      navDirection: undefined as 'left' | 'right' | undefined,
      mode: 'dark',
      theme: Object.keys(Themes.dark)[0],
      changeTheme: (mode: 'dark' | 'light' = 'dark', theme: string = 'blue') => {
        if (theme in Themes[mode]) {
          for (const [alias, color] of Object.entries(Themes[mode][theme])) {
            document.documentElement.style.setProperty(`--${alias}`, color);
          }
        }
        set({ mode: mode, theme: theme });
      },
      setState: (newState) => set(newState),
    }),
    {
      name: 'jantoom-games-global',
      storage: createDefaultJSONStorage(),
      version: 0.01,
    },
  ),
);
