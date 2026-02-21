import type { StompSubscription } from '@stomp/stompjs';

export interface Subscription {
  name: string;
  sub: StompSubscription;
}
