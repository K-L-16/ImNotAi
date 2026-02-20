import { useNavigate } from 'react-router';

export const CreateRoomButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/create-room');
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
