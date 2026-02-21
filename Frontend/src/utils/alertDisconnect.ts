import { useNavigate } from 'react-router';

export const alertDisconnect = (playerID: string) => {
  const navigate = useNavigate();
  alert(
    `player with ID ${playerID} disconnected, we are sorry to inform you that the game would end due to some force majeure factor.`
  );
  navigate('/');
};
