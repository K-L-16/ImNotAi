import { useNavigate } from 'react-router';
import { useRoom } from '../stores/useRoom';
import { useEffect } from 'react';
import { usePlayer } from '../stores/usePlayer';
import { useGameStatus } from '../stores/useGameStatus';
import { useClient } from '../stores/useClient';
// import { subscribeToGameState } from '../utils/subscribes';
import { alertDisconnect } from '../utils/alertDisconnect';
import { useTerminateStatus } from '../stores/useTerminateStatus';

const GameInfo = () => {
  const { gameStatus } = useGameStatus();
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-3 w-[85%] h-1/2 mx-auto mt-20">
        <p className="col-start-1 col-end-5 row-start-1 row-end-3 text-center place-content-center rounded-4xl text-3xl font-mono text-[#666666] bg-gray-300 shadow-[inset_20px_20px_20px_white,inset_-20px_-20px_20px_gray,8px_8px_16px_gray]">
          room code: {gameStatus.roomCode}
        </p>
        <p className="col-start-1 col-end-3 text-center place-content-center rounded-4xl text-2xl font-mono text-[#666666] bg-gray-300 shadow-[inset_20px_20px_20px_white,inset_-20px_-20px_20px_gray,8px_8px_16px_gray]">
          max number of REAL people: {gameStatus.maxPlayers}
        </p>
        <p className="col-start-3 col-end-5 text-center place-content-center rounded-4xl text-2xl font-mono text-[#666666] bg-gray-300 shadow-[inset_20px_20px_20px_white,inset_-20px_-20px_20px_gray,8px_8px_16px_gray]">
          current number of people: {gameStatus.playerCount}
        </p>
      </div>
      <div className="block w-auto h-1 mt-5 bg-linear-to-r from-white via-black to-white"></div>
    </>
  );
};

const StartButton = () => {
  const {} = useClient();
  const {} = useGameStatus();
  const {} = usePlayer();
  const navigate = useNavigate();
  const playerID = usePlayer.getState().player.playerID;
  const handleClick = () => {
    if (useGameStatus.getState().gameStatus.playerCount >= 2) {
      useClient.getState().client!.publish({
        destination: `app/room/${useGameStatus.getState().gameStatus.roomCode}/action`,
        body: JSON.stringify({
          type: 'START',
          playerID,
          payload: {}
        })
      });
      navigate(`/room/${useRoom.getState().room.roomCode}`);
    } else {
      alert('Ooooops, you must have 2 or more player to start a game!');
    }
  };
  return (
    <div className="flex w-screen justify-center">
      <button
        onClick={handleClick}
        className="relative px-5 py-3 mt-3 rounded-3xl group bg-green-500 hover:bg-red-400 hover:scale-110 shadow-[8px_8px_16px_gray,inset_-8px_-8px_16px_green,inset_8px_8px_16px_#ffffff] hover:shadow-[8px_8px_16px_gray,inset_-8px_-8px_16px_red,inset_8px_8px_16px_white] active:shadow-[inset_8px_8px_16px_#ff0000] active:translate-y-1 text-2xl cursor-pointer duration-500">
        <span className="block group-hover:hidden">START</span>
        <span className="hidden group-hover:block">
          Shh! There's an AI among us...
        </span>
      </button>
    </div>
  );
};

const WaitingMessage = () => {
  return (
    <div className="w-fit mx-auto font-mono mt-2 text-xl">
      waiting for the host to start the game...
    </div>
  );
};

export const WaitingHallPage = () => {
  const {} = useRoom();
  const {} = usePlayer();
  const { connect, unsubscribeAll, disconnect } = useClient();
  const { terminateStatus } = useTerminateStatus();
  const navigate = useNavigate();
  const { addSubscription } = useClient();
  // const {
  //   setRoomCode,
  //   setStatus,
  //   setLocked,
  //   setRound,
  //   setPlayerCount,
  //   setMaxPlayers,
  //   setPremise
  // } = useGameStatus();
  useEffect(() => {
    connect(
      `${import.meta.env.VITE_API_URL}/ws?roomCode=${useRoom.getState().room.roomCode}&playerId=${usePlayer.getState().player.playerID}`
    );
    useClient.getState().client!.onConnect = () => {
      const roomCode = useGameStatus.getState().gameStatus.roomCode;
      // listen to game status change
      useClient.getState().addSubscription({
        name: 'subGameState',
        sub: useClient
          .getState()
          .client!.subscribe(`/ws/topic/room/${roomCode}/state`, msg => {
            const state = JSON.parse(msg.body);
            useGameStatus.getState().setRoomCode(state.roomCode);
            useGameStatus.getState().setStatus(state.status);
            useGameStatus.getState().setLocked(state.locked);
            useGameStatus.getState().setRound(state.round);
            useGameStatus.getState().setPlayerCount(state.PlayerCount);
            useGameStatus.getState().setMaxPlayers(state.maxPlayers);
            useGameStatus.getState().setPremise(state.premise);
          })
      });
      if (usePlayer.getState().player.isHost) {
        useGameStatus.getState().setMaxPlayers(4);
        useGameStatus.getState().setPlayerCount(1);
      }
    };
    return () => {
      unsubscribeAll();
    };
  }, []);
  useEffect(() => {
    if (useGameStatus.getState().gameStatus.status == 'SPEAKING') {
      navigate(`/room/${useRoom.getState().room.roomCode}`);
    } else if (useGameStatus.getState().gameStatus.status == 'ENDED') {
      unsubscribeAll();
      disconnect();
      alertDisconnect(terminateStatus.playerID);
    }
  }, [useGameStatus.getState().gameStatus.status]);
  return (
    <div className="flex-wrap h-screen w-screen justify-center ">
      <GameInfo />
      {usePlayer.getState().player.isHost && <StartButton />}
      {!usePlayer.getState().player.isHost && <WaitingMessage />}
    </div>
  );
};
