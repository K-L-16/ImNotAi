import { useNavigate } from 'react-router';
import { api } from '../stores/api';
import { usePremise } from '../stores/usePremise';
import { usePlayer } from '../stores/usePlayer';
import { useRoom } from '../stores/useRoom';
import { useState } from 'react';

const AskPremise = () => {
  const { setPremise } = usePremise();
  const navigate = useNavigate();
  const { createPlayer, hostGame } = usePlayer();
  const { setRoom } = useRoom();
  const [postError, setPostError] = useState(' ');
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    setPostError(' ');
    ev.preventDefault();
    api
      .post('/api/rooms', { premise: usePremise.getState().premise })
      .then(response => {
        if (response.data.code == '1') {
          createPlayer(response.data.data.playerId, response.data.data.isHost);
          hostGame();
          setRoom(response.data.data.roomCode);
          navigate('/create-room');
        } else {
          setPostError(response.data.msg);
        }
      })
      .catch((error: any) => {
        setPostError(error.message);
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
      {postError != ' ' && <p>Oops, {postError}</p>}
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
