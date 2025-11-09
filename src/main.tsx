import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/feature[auth-google-login]/components/Home'
import { Login } from './pages/feature[auth-google-login]/components/Login'
import { AuthProvider } from './pages/feature[auth-google-login]/context/AuthContext'
import ShowInfo from './pages/feature[auth-google-login]/components/ShowInfo'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/info' element={<ShowInfo/>}></Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
  </StrictMode>,
)
