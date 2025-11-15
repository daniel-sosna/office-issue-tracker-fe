import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Login } from '@pages/Login'
import { Home } from '@pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

export const App = () => {
  return <RouterProvider router={router} />
};
