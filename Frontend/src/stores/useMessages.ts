import { create } from 'zustand';
import type { Message } from '../types/Message';

export const useMessages = create<{
  visibleMessages: Array<Message>;
  addVisibleMessage: (newMessage: Message) => void;
  resetVisibleMessage: () => void;
}>(set => ({
  visibleMessages: [],
  addVisibleMessage: (newMessage: Message) => {
    set(state => ({
      visibleMessages: [...state.visibleMessages, newMessage]
    }));
  },
  resetVisibleMessage: () => {
    set(() => ({
      visibleMessages: []
    }));
  }
}));
