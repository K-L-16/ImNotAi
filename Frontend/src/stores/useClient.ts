import { Client } from '@stomp/stompjs';
import { create } from 'zustand';
import SockJS from 'sockjs-client';
import type { Subscription } from '../types/Subscription';

export const useClient = create<{
  client: Client | null;
  subscriptions: Array<Subscription>;
  connect: (url: string) => void;
  disconnect: () => void;
  addSubscription: (sub: Subscription) => void;
  unsubscribeAll: () => void;
  unsubscribe: (subName: string) => void;
}>((set, get) => ({
  client: null,
  subscriptions: [],
  connect: (url: string) => {
    if (get().client == null) {
      const clientSet = new Client({
        webSocketFactory: () => new SockJS(url),
        reconnectDelay: 5000,
        brokerURL: import.meta.env.VITE_BACKEND_WS_URL
      });
      set(() => ({
        client: clientSet
      }));
      get().client!.activate();
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
  addSubscription: (sub: Subscription) => {
    get().subscriptions.push(sub);
  },
  unsubscribeAll: () => {
    get().subscriptions.forEach(sub => {
      sub.sub.unsubscribe();
    });
    set(() => ({
      subscriptions: []
    }));
  },
  unsubscribe: (subName: string) => {
    const subToRemove = get().subscriptions.find(sub => {
      sub.name == subName;
    });
    if (typeof subToRemove != 'undefined') {
      subToRemove.sub.unsubscribe();
      set(state => ({
        subscriptions: state.subscriptions.filter(sub => {
          sub.name != subName;
        })
      }));
    }
  }
}));
