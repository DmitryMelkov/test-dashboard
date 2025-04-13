import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Efficiency from '../pages/Efficiency/Efficiency';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'efficiency',
        element: <Efficiency />,
      },
      {
        path: '*',
        element: <div>Страница не найдена</div>,
      },
    ],
  },
]);
