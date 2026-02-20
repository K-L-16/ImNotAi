import { createBrowserRouter } from 'react-router';
import { HomeView } from '../views/HomeView';
import { CreateRoomView } from '../views/CreateRoomView';

const routes = [
  {
    path: '/',
    element: <HomeView />
  },
  {
    path: '/create-room',
    element: <CreateRoomView />
  },
];
export const router = createBrowserRouter(routes);
