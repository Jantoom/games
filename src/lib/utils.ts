import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  return `${hrs ? `${hrs}:` : ''}${mins.toString().padStart(hrs ? 2 : 1, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const getGamesData = () =>
  JSON.parse(localStorage.getItem(`jantoom-games`) ?? '{}');

export const saveGameData = (gamesData: object, gameData: object) =>
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
