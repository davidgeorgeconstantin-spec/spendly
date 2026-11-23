import { useEffect, useState } from 'react';

/**
 * Works like useState, but the value is also saved in localStorage,
 * so it survives a page refresh.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy initial state: this function runs only on the first render.
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Every time `value` changes, write it to localStorage.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
