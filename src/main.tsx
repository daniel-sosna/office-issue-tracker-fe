import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'
import { AuthProvider } from './context/AuthContext'
//import { Home } from './pages/feature[auth-google-login]/components/Home'
//import { Login } from './pages/feature[auth-google-login]/components/Login'
//import { AuthProvider } from './pages/feature[auth-google-login]/context/AuthContext'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
  </StrictMode>,
)
