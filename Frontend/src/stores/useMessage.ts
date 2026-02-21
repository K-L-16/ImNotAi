import type { Message } from '../types/Message';
import { create } from 'zustand';

export const useMessage = create<{
  message: Message;
  setMessage: (messageSet: Message) => void;
}>(set => ({
  message: { playerID: '', text: '' },
  setMessage: (messageSet: Message) => {
    set(() => ({
      message: messageSet
    }));
  }
}));
