import { Client, type StompSubscription } from '@stomp/stompjs';
import { create } from 'zustand';
import SockJS from 'sockjs-client';

export const useClient = create<{
  client: Client | null;
  subscriptions: Array<StompSubscription>;
  connect: (url: string) => void;
  disconnect: () => void;
  addSubscription: (sub: StompSubscription) => void;
  unsubscribeAll: () => void;
}>((set, get) => ({
  client: null,
  subscriptions: [],
  connect: (url: string) => {
    if (get().client == null) {
      const clientSet = new Client({
        webSocketFactory: () => new SockJS(url),
        reconnectDelay: 5000
      });
      set(() => ({
        client: clientSet
      }));
    }
  },
  disconnect: () => {
    if (get().subscriptions.length != 0) {
      get().unsubscribeAll();
    }
    if (get().client != null) {
      get().client!.deactivate();
    }
  },
  addSubscription: (sub: StompSubscription) => {
    get().subscriptions.push(sub);
  },
  unsubscribeAll: () => {
    get().subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}));
