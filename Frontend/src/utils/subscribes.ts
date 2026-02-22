// import { useClient } from '../stores/useClient';
// import { useGameStatus } from '../stores/useGameStatus';
// import { useRoundStatus } from '../stores/useRoundStatus';
// import { useTerminateStatus } from '../stores/useTerminateStatus';
// import { useVoteResult } from '../stores/useVoteResult';
// import type { VoteCount } from '../types/VoteCount';

// export const subscribeToGameState = () => {
//   const { addSubscription } = useClient();
//   const { 
//     setRoomCode,
//     setStatus,
//     setLocked,
//     setRound,
//     setPlayerCount,
//     setMaxPlayers,
//     setPremise
//    } = useGameStatus();
//   const roomCode = useGameStatus.getState().gameStatus.roomCode;
//   // listen to game status change
//   addSubscription({
//     name: 'subGameState',
//     sub: useClient
//       .getState()
//       .client!.subscribe(`/topic/room/${roomCode}/state`, msg => {
//         const state = JSON.parse(msg.body);
//         setRoomCode(state.roomCode);
//         setStatus(state.status);
//         setLocked(state.locked);
//         setRound(state.round);
//         setPlayerCount(state.PlayerCount);
//         setMaxPlayers(state.maxPlayers);
//         setPremise(state.premise);
//       })
//   });
// };

// export const subscribeToRoundStatus = () => {
//   const { setRoundStatus, setMessages } = useRoundStatus();
//   const { addSubscription } = useClient();
//   const roomCode = useGameStatus.getState().gameStatus.roomCode;
//   addSubscription({
//     name: 'subRoundState',
//     sub: useClient
//       .getState()
//       .client!.subscribe(`/topic/room/${roomCode}/round-message`, msg => {
//         const state = JSON.parse(msg.body);
//         setRoundStatus(state.round);
//         setMessages(state.messages);
//       })
//   });
// };

// export const subscribeToVoteResult = () => {
//   const { setVoteRound, setVoteCount, setElimatedID, setTie, setReason } =
//     useVoteResult();
//   const { addSubscription } = useClient();
//   const roomCode = useGameStatus.getState().gameStatus.roomCode;
//   addSubscription({
//     name: 'subVoteResult',
//     sub: useClient
//       .getState()
//       .client!.subscribe(`/topic/room/${roomCode}/vote-result`, msg => {
//         const state = JSON.parse(msg.body);
//         setVoteRound(state.round);
//         const voteCounts = Object.entries(state.voteCount).map(voteCount => {
//           return { playerID: voteCount[0], count: voteCount[1] } as VoteCount;
//         });
//         setVoteCount(voteCounts);
//         setElimatedID(state.elimatedId);
//         setTie(state.tie);
//         setReason(state.reason);
//       })
//   });
// };

// export const subscribeToTerminate = () => {
//   const { addSubscription } = useClient();
//   const { setReason, setPlayerID } = useTerminateStatus();
//   const roomCode = useGameStatus.getState().gameStatus.roomCode;
//   addSubscription({
//     name: 'subTerminate',
//     sub: useClient
//       .getState()
//       .client!.subscribe(`topic/room/${roomCode}/terminated`, msg => {
//         const state = JSON.parse(msg.body);
//         setReason(state.reason);
//         setPlayerID(state.playerID);
//       })
//   });
// };
