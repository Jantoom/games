import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GamesData, SerializableSet } from './types';

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
      day: '2-digit',
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

export const getGamesData = (): GamesData => {
  const regex = /\d-\d/;
  const shouldBeSet = (key: string) =>
    regex.test(key) || key === 'bombs' || key === 'flags';

  return JSON.parse(
    localStorage.getItem(`jantoom-games`) ?? '{}',
    (key, value) => {
      if (value && shouldBeSet(key)) {
        return new SerializableSet([...value]);
      }
      return value;
    },
  );
};

export const saveGameData = (gamesData: GamesData, gameData: object) =>
  localStorage.setItem(
    'jantoom-games',
    JSON.stringify({
      ...gamesData,
      ...gameData,
    }),
  );

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
