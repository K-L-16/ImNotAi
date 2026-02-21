import { create } from 'zustand';
import type { Player } from '../types/Player';

export const usePlayer = create<{
  player: Player;
  eliminated: boolean;
  createPlayer: (playerIDSet: string, isHostSet: boolean) => void;
  hostGame: () => void;
  beElliminated: () => void;
}>(set => ({
  player: {
    playerID: '',
    isHost: false
  },
  eliminated: false,
  createPlayer: (playerIDSet: string, isHostSet: boolean) => {
    set(() => ({
      player: {
        playerID: playerIDSet,
        isHost: isHostSet
      }
    }));
  },
  hostGame: () => {
    set(state => ({
      player: {
        ...state.player,
        isHost: true
      }
    }));
  },
  beElliminated: () => {
    set(() => ({
      eliminated: true
    }));
  }
}));
