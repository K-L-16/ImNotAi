import { create } from 'zustand';
import type { GameStatus } from '../types/GameStatus';

export const useGameStatus = create<{
  gameStatus: GameStatus;
  setRoomCode: (roomCodeSet: string) => void;
  setStatus: (statusSet: string) => void;
  setLocked: (lockedSet: boolean) => void;
  setRound: (roundSet: number) => void;
  setPlayerCount: (playerCountSet: number) => void;
  setMaxPlayers: (maxPlayers: number) => void;
  setPremise: (premise: string) => void;
}>(set => ({
  gameStatus: {
    roomCode: ' ',
    status: ' ',
    locked: false,
    round: 0,
    playerCount: 0,
    maxPlayers: 0,
    premise: ' '
  },
  setRoomCode: (roomCodeSet: string) => {
    set(state => ({
      gameStatus: {
        ...state.gameStatus,
        roomCode: roomCodeSet
      }
    }));
  },
  setStatus: (statusSet: string) => {
    set(state => ({
      gameStatus: {
        ...state.gameStatus,
        status: statusSet
      }
    }));
  },
  setLocked: (lockedSet: boolean) => {
    set(state => ({
      gameStatus: {
        ...state.gameStatus,
        locked: lockedSet
      }
    }));
  },
  setRound: (roundSet: number) => {
    set(state => ({
      gameStatus: {
        ...state.gameStatus,
        round: roundSet
      }
    }));
  },
  setPlayerCount: (playerCountSet: number) => {
    set(state => ({
      gameStatus: {
        ...state.gameStatus,
        playerCount: playerCountSet
      }
    }));
  },
  setMaxPlayers: (maxPlayersSet: number) => {
    set(state => ({
      gameStatus: {
        ...state.gameStatus,
        maxPlayers: maxPlayersSet
      }
    }));
  },
  setPremise: (premiseSet: string) => {
    set(state => ({
      gameStatus: {
        ...state.gameStatus,
        premise: premiseSet
      }
    }));
  }
}));
