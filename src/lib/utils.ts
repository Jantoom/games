import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createJSONStorage } from 'zustand/middleware';

/**
 *
 * @param {...any} inputs
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 60 / 60);
  const mins = Math.floor(seconds / 60) % 60;
  const secs = seconds % 60;
  return (
    `${hrs ? `${hrs}H ` : ''}` +
    `${hrs || mins ? `${mins}M ` : ''}` +
    `${secs}S`
  );
};

export const formatDate = (date: string) => {
  return new Date(date)
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .replace(',', '');
};

export const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const addUrlSubpath = (url: string, param: string) => {
  return url + param;
};

export const swapLastUrlSubpath = (url: string, param: string) => {
  const segments = url.split('/');
  segments[segments.length - 1] = param.startsWith('/')
    ? param.slice(1)
    : param;
  return segments.join('/');
};

export const goToUrlSubpath = (url: string, index: number) => {
  return url.split('/').slice(0, index).join('/');
};

export const createDefaultJSONStorage = () => {
  return createJSONStorage(() => localStorage, {
    reviver: (_key, value: any) =>
      value && value.type === 'set' ? new Set(value.value) : value,
    replacer: (_key, value) =>
      value instanceof Set ? { type: 'set', value: [...value] } : value,
  });
};

export const rgbToHsl = (rgbStr: string): [number, number, number] => {
  let [r, g, b] = rgbStr.split(' ').map(Number) as [number, number, number];
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

export const adjustHsl = (
  hsl: [number, number, number],
  dh: number = 0,
  ds: number = 0,
  dl: number = 0,
): string => {
  const [h, s, l] = hsl;
  const newH = Math.max(0, Math.min(360, h + dh));
  const newS = Math.max(0, Math.min(100, s + ds));
  const newL = Math.max(0, Math.min(100, l + dl));
  return `hsl(${newH}, ${newS}%, ${newL}%)`;
};

declare global {
  /* eslint-disable unused-imports/no-unused-vars */
  interface Array<T> {
    falsyIfEmpty(): this | false;
    toObject<K extends PropertyKey, V>(this: [K, V][]): Record<K, V>;
  }
}

Array.prototype.falsyIfEmpty = function <T>() {
  return (this as T[]).length > 0 ? (this as T[]) : false;
};

Array.prototype.toObject = function <K extends PropertyKey, V>(this: [K, V][]) {
  return Object.fromEntries(this) as Record<K, V>;
};
