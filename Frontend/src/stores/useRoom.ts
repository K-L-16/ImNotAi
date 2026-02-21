import { create } from 'zustand';
import type { Room } from '../types/Room';

export const useRoom = create<{
  room: Room;
  setRoom: (roomCodeSet: string) => void;
}>(set => ({
  room: {
    roomCode: ' '
  },
  setRoom: (roomCodeSet: string) => {
    set(() => ({
      room: {
        roomCode: roomCodeSet
      }
    }));
  }
}));
