import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './layouts/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoutesPage from './pages/RoutesPage';
import RouteEditorPage from './pages/RouteEditorPage';
import AttractionsPage from './pages/AttractionsPage';
import UsersPage from './pages/UsersPage';
import { ProtectedRoute } from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'routes',
        element: <RoutesPage />,
      },
      {
        path: 'routes/new',
        element: <RouteEditorPage />,
      },
      {
        path: 'routes/:id/edit',
        element: <RouteEditorPage />,
      },
      {
        path: 'attractions',
        element: <AttractionsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}