import { useNavigate } from 'react-router';
import { useRoom } from '../stores/useRoom';
import { useEffect } from 'react';
import { usePlayer } from '../stores/usePlayer';
import { useGameStatus } from '../stores/useGameStatus';
import { useClient } from '../stores/useClient';
import { subscribeToGameState } from '../utils/subscribes';

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
  const {} = useGameStatus();
  const { connect, unsubscribeAll } = useClient();
  useEffect(() => {
    connect(`${import.meta.env.BASE_URL}/ws`);
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
