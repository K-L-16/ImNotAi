import { useNavigate } from 'react-router';
import { useRoom } from '../stores/useRoom';
import { useEffect } from 'react';
import { usePlayer } from '../stores/usePlayer';

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
    navigate(`/room/${useRoom.getState().room.roomCode}`);
  };
  return (
    <>
      <button onClick={handleClick}>START</button>
    </>
  );
};

const WaitingMessage = () => {
    return(
        <p>waiting for the host to start the game...</p>
    )
}

export const WaitingHallPage = () => {
  const {} = usePlayer();
  return (
    <>
      <GameInfo />
      {usePlayer.getState().player.isHost && <StartButton />}
      {!usePlayer.getState().player.isHost && <WaitingMessage />}
    </>
  );
};
