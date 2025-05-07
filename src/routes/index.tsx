import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Efficiency from '../pages/Efficiency/Efficiency';
import FuelNorms from '../pages/FuelNorms/FuelNorms';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
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
            path: 'fuel-norms',
            element: <FuelNorms />,
          },
          {
            path: '*',
            element: <div>Страница не найдена</div>,
          },
        ],
      },
    ],
  },
]);