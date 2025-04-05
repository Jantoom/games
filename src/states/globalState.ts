import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { Themes } from '@/lib/styles';

export const useGlobalState = create(
  combine(
    {
      theme: localStorage.getItem('theme') ?? Object.keys(Themes)[0]!,
    },
    (set) => ({
      setTheme: (theme: string) => {
        if (theme in Themes) {
          for (const [colorAlias, hexCode] of Object.entries(Themes[theme]!)) {
            document.documentElement.style.setProperty(
              `--${colorAlias}`,
              hexCode,
            );
          }
          localStorage.setItem('theme', theme);
        }
        set({ theme: theme });
      },
    }),
  ),
);
