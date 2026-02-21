import { CreateRoomButton } from '../components/createRoom';
import { JoinRoomButton } from '../components/joinRoom';
import { Title } from '../components/Title';

export const HomeView = () => {
  return (
    <>
      <Title />
      <CreateRoomButton />
      <JoinRoomButton />
    </>
  );
};
