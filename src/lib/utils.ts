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
