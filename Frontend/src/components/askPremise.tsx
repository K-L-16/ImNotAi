import { useNavigate } from 'react-router';
import { api } from '../stores/api';
import { usePremise } from '../stores/usePremise';
import { usePlayer } from '../stores/usePlayer';
import { useRoom } from '../stores/useRoom';
import { useError } from '../stores/useError';

const AskPremise = () => {
  const { setPremise } = usePremise();
  const navigate = useNavigate();
  const { createPlayer, hostGame } = usePlayer();
  const { setRoom } = useRoom();
  const { setError } = useError();
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    setError(' ');
    ev.preventDefault();
    api
      .post('/api/rooms', { premise: usePremise.getState().premise })
      .then(response => {
        if (response.data.code == '1') {
          createPlayer(response.data.data.playerId, response.data.data.isHost);
          hostGame();
          setRoom(response.data.data.roomCode);
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
        required
        placeholder="please enter a premise here: "
        onChange={ev => setPremise(ev.target.value)}></input>
      <button type="submit">Submit</button>
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

export const AskPremisePage = () => {
  return (
    <>
      <AskPremise />
      <CancelButton />
    </>
  );
};
