import { create } from 'zustand';
import type { VoteResult } from '../types/VoteResult';
import type { VoteCount } from '../types/VoteCount';

export const useVoteResult = create<{
  voteResult: VoteResult;
  setVoteRound: (voteRoundSet: number) => void;
  setVoteCount: (voteCountSet: Array<VoteCount>) => void;
  setElimatedID: (elimatedIDSet: string) => void;
  setTie: (tieSet: boolean) => void;
  setReason: (reasonSet: string) => void;
}>(set => ({
  voteResult: {
    voteRound: 0,
    voteCount: [],
    elimatedID: '',
    tie: false,
    reason: ''
  },
  setVoteRound: (voteRoundSet: number) => {
    set(state => ({
      voteResult: {
        ...state.voteResult,
        voteRound: voteRoundSet
      }
    }));
  },
  setVoteCount: (voteCountSet: Array<VoteCount>) => {
    set(state => ({
      voteResult: {
        ...state.voteResult,
        voteCount: voteCountSet
      }
    }));
  },
  setElimatedID: (elimatedIDSet: string) => {
    set(state => ({
      voteResult: {
        ...state.voteResult,
        elimatedID: elimatedIDSet
      }
    }));
  },
  setTie: (tieSet: boolean) => {
    set(state => ({
      voteResult: {
        ...state.voteResult,
        tie: tieSet
      }
    }));
  },
  setReason: (reasonSet: string) => {
    set(state => ({
      voteResult: {
        ...state.voteResult,
        reason: reasonSet
      }
    }));
  }
}));
