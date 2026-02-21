import { useNavigate } from 'react-router';
import { useRoom } from '../stores/useRoom';
import { useEffect } from 'react';
import { usePlayer } from '../stores/usePlayer';
import { useGameStatus } from '../stores/useGameStatus';
import { useClient } from '../stores/useClient';

const GameInfo = () => {
  return (
    <>
      <p>max number of REAL people: 4</p>
      <p>invite code: aaa</p>
      <p>current number of people: 0</p>
    </>
  );
};

const StartButton = () => {
  const navigate = useNavigate();
  const { setRoom } = useRoom();
  useEffect(() => {
    setRoom('12345');
  }, []);
  const handleClick = () => {
    handleEnterRoom();
  };
  return (
    <>
      <button onClick={handleClick}>START</button>
    </>
  );
};

const WaitingMessage = () => {
  return <p>waiting for the host to start the game...</p>;
};

const handleEnterRoom = () => {
  const navigate = useNavigate();
  navigate(`/room/${useRoom.getState().room.roomCode}`);
};

export const WaitingHallPage = () => {
  const {} = useRoom();
  const {} = usePlayer();
  const roomCode = useRoom.getState().room.roomCode;
  const {
    setRoomCode,
    setStatus,
    setLocked,
    setRound,
    setPlayerCount,
    setMaxPlayers,
    setPremise
  } = useGameStatus();
  const { connect, disconnect, addSubscription } = useClient();
  useEffect(() => {
    connect(`${import.meta.env.BASE_URL}/ws`);
    useClient.getState().client!.onConnect = () => {
      addSubscription(
        useClient
          .getState()
          .client!.subscribe(`/topic/room/${roomCode}/state`, msg => {
            const state = JSON.parse(msg.body);
            setRoomCode(state.roomCode);
            setStatus(state.status);
            setLocked(state.locked);
            setRound(state.round);
            setPlayerCount(state.PlayerCount);
            setMaxPlayers(state.maxPlayers);
            setPremise(state.premise);
          })
      );
    };
    return () => {
      disconnect();
    };
  }, []);
  useEffect(() => {
    if (useGameStatus.getState().gameStatus.status == 'SPEAKING') {
      handleEnterRoom();
    }
  }, [useGameStatus.getState().gameStatus.status]);
  return (
    <>
      <GameInfo />
      {usePlayer.getState().player.isHost && <StartButton />}
      {!usePlayer.getState().player.isHost && <WaitingMessage />}
    </>
  );
};
