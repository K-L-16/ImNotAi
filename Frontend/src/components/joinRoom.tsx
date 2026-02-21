import { useNavigate } from 'react-router';
import { useRoom } from '../stores/useRoom';
import { api } from '../stores/api';
import { useError } from '../stores/useError';
import { usePlayer } from '../stores/usePlayer';

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
  const { setError } = useError();
  const { createPlayer } = usePlayer();
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    api
      .post(`/${useRoom.getState().room.roomCode}/join`)
      .then(response => {
        if (response.data.code == '1') {
          createPlayer(response.data.data.playerId, response.data.data.isHost);
          navigate(`/waiting-hall/${useRoom.getState().room.roomCode}`);
        } else {
          setError(response.data.msg);
        }
      })
      .catch((error: any) => {
        setError(error.message);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="enter your code here:"
        onChange={ev => setRoom(ev.target.value)}></input>
      <button type="submit">Join</button>
      {useError.getState().error != ' ' && (
        <p>Oops, something goes wrong - {useError.getState().error}</p>
      )}
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
