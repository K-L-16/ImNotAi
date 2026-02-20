import { createBrowserRouter } from 'react-router';
import { HomeView } from '../views/HomeView';
import { CreateRoomView } from '../views/CreateRoomView';
import { JoinRoomView } from '../views/JoinRoomView';

const routes = [
  {
    path: '/',
    element: <HomeView />
  },
  {
    path: '/create-room',
    element: <CreateRoomView />
  },
  {
    path: '/join-room',
    element: <JoinRoomView />
  }
];
export const router = createBrowserRouter(routes);
