import { useNavigate } from 'react-router';

export const JoinRoomButton = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/join-room");
    }
  return (
    <>
      <button onClick={handleClick}>Join Room</button>
    </>
  );
};

const JoinRoomCodeEnter = () => {
  return (
    <>
      <input type="text" placeholder="enter your code here:"></input>
    </>
  );
};

const JoinButton = () => {
  return (
    <>
      <button>Join</button>
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

export const JoinRoomPage = () => {
  return (
    <>
      <JoinRoomCodeEnter />
      <JoinButton />
      <CancelButton />
    </>
  );
};
