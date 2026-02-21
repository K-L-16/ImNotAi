export interface GameStatus {
  roomCode: string;
  status: string; // LOBBY, SPEAKING, VOTING, ENDED
  locked: boolean;
  round: number;
  playerCount: number;
  maxPlayers: number;
  premise: string;
}
