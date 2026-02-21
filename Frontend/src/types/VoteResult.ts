import type { VoteCount } from './VoteCount';

export interface VoteResult {
  voteRound: number;
  voteCount: Array<VoteCount>;
  elimatedID: string;
  tie: boolean;
  reason: string | undefined;
}
