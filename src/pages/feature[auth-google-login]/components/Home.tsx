import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"


export const Home = () => {
  const {isAuthenticated, loading} = useAuth();

  if(loading){
    return <div>Loading...</div>
  }

  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    window.location.href = 'http://localhost:8080/logout';
  }

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 text-while px- py-2 rounded cursor-pointer"
    >
        Logout
    </button>
  )
}
