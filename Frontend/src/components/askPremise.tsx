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
    <form
      onSubmit={handleSubmit}
      className="flex-wrap relative w-screen mt-70 justify-center ">
      <input
        type="text"
        id="inputPremise"
        required
        placeholder="Please enter a premise here (required): "
        className="block p-2 h-10 w-screen text-center bg-linear-to-br from-gray-100 to-gray-200 font-mono"
        onChange={ev => setPremise(ev.target.value)}></input>
      <div className="block w-auto h-0.5 bg-black"></div>
      <button
        type="submit"
        className="absolute left-[60%] w-50 h-fit mt-7 py-3 rounded-xl bg-green-500 hover:bg-green-400 active:bg-green-400 hover:scale-110 shadow-[8px_8px_16px_gray,inset_-8px_-8px_16px_green] active:shadow-[inset_8px_8px_16px_green] active:translate-y-1 cursor-pointer text-3xl font-mono text-white text-shadow-black ">
        Submit
      </button>
      {useError.getState().error != ' ' && (
        <p className="absolute w-screen text-center left-1/2 -translate-x-1/2 font-mono">Oops, something goes wrong - {useError.getState().error}</p>
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
      <button
        onClick={handleClick}
        className="absolute left-[28%] w-50 h-fit mt-7 py-3 rounded-xl bg-red-400 hover:bg-[#ff7575] active:bg-[#ff7575] hover:scale-110 shadow-[8px_8px_16px_gray,inset_-8px_-8px_16px_red] active:shadow-[inset_8px_8px_16px_red] active:translate-y-1 cursor-pointer text-3xl font-mono text-white text-shadow-black ">
        Cancel
      </button>
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
