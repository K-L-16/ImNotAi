import { useNavigate } from 'react-router';
import { usePlayer } from '../stores/usePlayer';
import { useState } from 'react';
import { api } from '../stores/api';
import { useRoom } from '../stores/useRoom';

export const CreateRoomButton = () => {
  const navigate = useNavigate();
  const { createPlayer, hostGame } = usePlayer();
  const { createRoom } = useRoom();
  const [postError, setPostError] = useState(' ');
  const handleClick = () => {
    api
      .post('/api/rooms')
      .then(response => {
        createPlayer(response.data.data.playerId, response.data.data.isHost);
        hostGame();
        createRoom(response.data.data.roomCode);
        navigate('/create-room');
      })
      .catch((error: any) => {
        setPostError(error.message);
      });
  };
  return (
    <>
      <button onClick={handleClick}>Create Room</button>
      {postError != ' ' && <p>Oops, {postError}</p>}
    </>
  );
};

const CreateRoomInfo = () => {
  return (
    <>
      <p>max number of REAL people: 4</p>
      <p>invite code: aaa</p>
      <p>current number of people: 0</p>
    </>
  );
};

const StartButton = () => {
  return (
    <>
      <button>START</button>
    </>
  );
};

const CancelButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  };
  return (
    <>
      <button onClick={handleClick}>Cancel</button>
    </>
  );
};

export const CreateRoomPage = () => {
  return (
    <>
      <CreateRoomInfo />
      <StartButton />
      <CancelButton />
    </>
  );
};
