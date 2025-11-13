import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import{
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'

import { Login } from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import { Home } from './pages/Home'

const router = createBrowserRouter([
  {
    path:'/',
    element:<Home />
  },
  {
    path: '/login',
    element: <Login />
  },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider> 
  </StrictMode>,
)
