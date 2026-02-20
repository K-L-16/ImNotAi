import { create } from 'zustand';
import type { Player } from '../types/Player';

export const usePlayer = create<{
  player: Player;
  createPlayer: (playerIDSet: string, isHostSet: boolean) => void;
  hostGame: () => void;
}>(set => ({
  player: {
    playerID: '',
    isHost: false
  },
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
  }
}));
