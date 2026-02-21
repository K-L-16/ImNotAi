import type { Message } from './Message';

export interface RoundStatus {
  round: number;
  messages: Array<Message>;
}
