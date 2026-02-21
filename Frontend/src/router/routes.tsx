import { createBrowserRouter } from 'react-router';
import { HomeView } from '../views/HomeView';
import { JoinRoomView } from '../views/JoinRoomView';
import { RoomView } from '../views/RoomView'
import { AskPremiseView } from '../views/AskPremiseView';
import { WaitingHallView } from '../views/WaitingHallView';

const routes = [
  {
    path: '/',
    element: <HomeView />
  },
  {
    path: '/join-room',
    element: <JoinRoomView />
  },
  {
    path: '/ask-premise',
    element: <AskPremiseView />
  },
  {
    path: '/waiting-hall/:roomCode',
    element: <WaitingHallView />
  },
  {
    path: '/room/:roomCode',
    element: <RoomView />
  }
];
export const router = createBrowserRouter(routes);
