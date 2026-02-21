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
      <button
        className="absolute left-[55%] p-3 my-3 w-60 rounded-3xl bg-blue-300 text-3xl text-white cursor-pointer hover:scale-110 hover:bg-[#a8d6ff] shadow-[8px_8px_20px_gray,inset_-8px_-8px_8px_#4987b3,inset_6px_6px_16px_white] active:shadow-[inset_8px_8px_8px_#4987b3] active:translate-y-1 duration-300"        onClick={handleClick}>
        Join Room
      </button>
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
    <form
      onSubmit={handleSubmit}
      className="flex-wrap relative w-screen mt-60 justify-center">
      <input
        type="text"
        id="joinCodeInput"
        placeholder="enter your room code here:"
        className="block w-70 h-30 text-center rounded-3xl border-blue-600 border-4 mx-auto"
        onChange={ev => setRoom(ev.target.value)}></input>
      <button
        type="submit"
        className="absolute left-[60%] w-50 h-fit mt-7 py-3 rounded-xl bg-green-500 hover:bg-green-400 active:bg-green-400 hover:scale-110 shadow-[8px_8px_16px_gray,inset_-8px_-8px_16px_green] active:shadow-[inset_8px_8px_16px_green] active:translate-y-1 cursor-pointer text-3xl font-mono text-white text-shadow-black ">
        Join
      </button>
      {useError.getState().error != ' ' && (
        <p className="absolute w-screen text-center left-1/2 -translate-x-1/2 font-mono">
          Oops, something goes wrong - {useError.getState().error}
        </p>
      )}
    </form>
  );
};

const CancelButton = () => {
  const navigate = useNavigate();
  const { setError } = useError();
  const handleClick = () => {
    setError(' ');
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

export const JoinRoomPage = () => {
  return (
    <>
      <JoinRoomForm />
      <CancelButton />
    </>
  );
};
