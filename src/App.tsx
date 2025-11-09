import './App.css'
import { Login } from './pages/feature[auth-google-login]/components/Login'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <Login />
      <Outlet />
    </>
  )
}

export default App
