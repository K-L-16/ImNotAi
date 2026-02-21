import { create } from 'zustand';
import { type RoundStatus } from '../types/RoundStatus';
import type { Message } from '../types/Message';

export const useRoundStatus = create<{
  roundStatus: RoundStatus;
  setRoundStatus: (roundSet: number) => void;
  setMessages: (messagesSet: Array<Message>) => void;
}>(set => ({
  roundStatus: {
    round: 0,
    messages: []
  },
  setRoundStatus: (roundSet: number) => {
    set(state => ({
      roundStatus: {
        ...state.roundStatus,
        round: roundSet
      }
    }));
  },
  setMessages: (messagesSet: Array<Message>) => {
    set(state => ({
      roundStatus: {
        ...state.roundStatus,
        messages: messagesSet
      }
    }));
  }
}));
