import { create } from 'zustand';
import type { TerminateStatus } from '../types/TerminateStatus';

export const useTerminateStatus = create<{
  terminateStatus: TerminateStatus;
  setReason: (reasonSet: string) => void;
  setPlayerID: (playerIDSet: string) => void;
}>(set => ({
  terminateStatus: {
    reason: '',
    playerID: ''
  },
  setReason: (reasonSet: string) => {
    set(state => ({
      terminateStatus: {
        ...state.terminateStatus,
        reason: reasonSet
      }
    }));
  },
  setPlayerID: (playerIDSet: string) => {
    set(state => ({
      terminateStatus: {
        ...state.terminateStatus,
        playerID: playerIDSet
      }
    }));
  }
}));
