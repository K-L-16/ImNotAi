import { create } from 'zustand';
import type { Room } from '../types/Room';

export const useRoom = create<{
  room: Room;
  createRoom: (roomCodeSet: string) => void;
}>(set => ({
  room: {
    roomCode: ' '
  },
  createRoom: (roomCodeSet: string) => {
    set(() => ({
      room: {
        roomCode: roomCodeSet
      }
    }));
  }
}));
