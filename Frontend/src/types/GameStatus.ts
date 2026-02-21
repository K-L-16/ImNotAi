export interface GameStatus {
  roomCode: string;
  status: string; // LOBBY, SPEAKING, VOTING, ENDED 表示游戏进行的状态
  locked: boolean; // 游戏开始之后无法再次按下开始按钮
  round: number;
  playerCount: number;
  maxPlayers: number;
  premise: string;
}
