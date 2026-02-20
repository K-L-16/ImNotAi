import { create } from 'zustand';

export const usePremise = create<{
  premise: string;
  setPremise: (premiseSet: string) => void;
}>(set => ({
  premise: '',
  setPremise: (premiseSet: string) => {
    set(() => ({
      premise: premiseSet
    }));
  }
}));
