import { useNavigate } from 'react-router';

export const CreateRoomButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/ask-premise');
  };
  return (
    <div className="relative flex left-0 w-1/2">
      <button
        className="absolute left-[55%] p-3 my-3 w-60 rounded-3xl bg-blue-300 text-3xl text-white cursor-pointer hover:scale-110 hover:bg-[#a8d6ff] shadow-[8px_8px_20px_gray,inset_-8px_-8px_8px_#4987b3,inset_6px_6px_16px_white] active:shadow-[inset_8px_8px_8px_#4987b3] active:translate-y-1 duration-300"
        onClick={handleClick}>
        Create Room
      </button>
    </div>
  );
};
