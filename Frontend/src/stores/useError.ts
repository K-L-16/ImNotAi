import { create } from 'zustand';

export const useError = create<{
  error: string;
  setError: (errorSet: string) => void;
}>(set => ({
  error: ' ',
  setError: (errorSet: string) => {
    set(() => ({
      error: errorSet
    }));
  }
}));
