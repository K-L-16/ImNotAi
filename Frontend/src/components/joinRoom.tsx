import { useNavigate } from 'react-router';
import { useRoom } from '../stores/useRoom';

export const JoinRoomButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/join-room');
  };
  return (
    <>
      <button onClick={handleClick}>Join Room</button>
    </>
  );
};

const JoinRoomForm = () => {
  const navigate = useNavigate();
  const { setRoom } = useRoom();
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    navigate(`/room/${useRoom.getState().room.roomCode}`);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="enter your code here:"
        onChange={ev => setRoom(ev.target.value)}></input>
      <button type="submit">Join</button>
    </form>
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
      <JoinRoomForm />
      <CancelButton />
    </>
  );
};
