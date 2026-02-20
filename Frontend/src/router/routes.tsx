import { createBrowserRouter } from 'react-router';
import { HomePage } from '../views/HomeView';

const routes = [
  {
    path: '/',
    element: <HomePage />
  }
];
export const router = createBrowserRouter(routes);
