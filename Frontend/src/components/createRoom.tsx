import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useRoom } from '../stores/useRoom';

export const CreateRoomButton = () => {
  const navigate = useNavigate();
    const handleClick = () => {
    navigate('/ask-premise');
  };
  return (
    <>
      <button onClick={handleClick}>Create Room</button>
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
  const navigate = useNavigate();
  const { setRoom } = useRoom();
  useEffect(() => {
    setRoom("12345");
  }, [])
  const handleClick = () => {
    navigate(`/room/${useRoom.getState().room.roomCode}`);
  };
  return (
    <>
      <button onClick={handleClick}>START</button>
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
