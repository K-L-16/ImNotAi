import { useNavigate } from 'react-router';

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
