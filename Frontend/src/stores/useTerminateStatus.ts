import { create } from 'zustand';
import type { TerminateStatus } from '../types/TerminateStatus';

export const useTerminateStatus = create<{
  terminateStatus: TerminateStatus;
  setReasonStatus: (reasonSet: string) => void;
  setPlayerID: (playerIDSet: string) => void;
}>(set => ({
  terminateStatus: {
    reason: '',
    playerID: ''
  },
  setReasonStatus: (reasonSet: string) => {
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
