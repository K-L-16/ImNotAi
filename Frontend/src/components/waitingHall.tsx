import { useNavigate } from 'react-router';
import { useRoom } from '../stores/useRoom';
import { useEffect } from 'react';
import { usePlayer } from '../stores/usePlayer';
import { useGameStatus } from '../stores/useGameStatus';
import { useClient } from '../stores/useClient';
import { subscribeToGameState } from '../utils/subscribes';
import { alertDisconnect } from '../utils/alertDisconnect';
import { useTerminateStatus } from '../stores/useTerminateStatus';

const GameInfo = () => {
  const { gameStatus } = useGameStatus();
  useEffect(() => {
    useGameStatus.getState().setMaxPlayers(4);
    useGameStatus.getState().setPlayerCount(2);
    useGameStatus.getState().setRoomCode('1234567890');
  }, []);
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
  const { setRoom } = useRoom();
  const {} = useClient();
  const {} = useGameStatus();
  const {} = usePlayer();
  const playerID = usePlayer.getState().player.playerID;
  useEffect(() => {
    setRoom('12345');
  }, []);
  const handleClick = () => {
    useClient.getState().client!.publish({
      destination: `app/room/${useGameStatus.getState().gameStatus.roomCode}/action`,
      body: JSON.stringify({
        type: 'START',
        playerID,
        payload: {}
      })
    });
    handleEnterRoom();
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

const handleEnterRoom = () => {
  const navigate = useNavigate();
  navigate(`/room/${useRoom.getState().room.roomCode}`);
};

export const WaitingHallPage = () => {
  const {} = useRoom();
  const {} = usePlayer();
  const {} = useGameStatus();
  const { connect, unsubscribeAll, disconnect } = useClient();
  const { terminateStatus } = useTerminateStatus();
  useEffect(() => {
    connect(
      `${import.meta.env.BASE_URL}/ws?roomCode=${useRoom.getState().room.roomCode}&playerId=${usePlayer.getState().player.playerID}`
    );
    useClient.getState().client!.onConnect = () => {
      subscribeToGameState();
    };
    return () => {
      unsubscribeAll();
    };
  }, []);
  useEffect(() => {
    if (useGameStatus.getState().gameStatus.status == 'SPEAKING') {
      handleEnterRoom();
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
