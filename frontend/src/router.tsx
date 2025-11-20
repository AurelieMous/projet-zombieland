import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    // element: <Layout />,
    children: [
      {
        index: true,
        // element: <Home />,
      },
      {
        path: 'activities',
        // element: <Activities />,
      },
      {
        path: 'activities/:id',
        // element: <ActivityDetail />,
      },
      {
        path: 'login',
        // element: <Login />,
      },
      {
        path: 'register',
        // element: <Register />,
      },
      {
        path: 'account',
        // element: <Account />,
      },
      {
        path: 'admin',
        // element: <Admin />,
      },
    ],
  },
]);

