import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

export const Home = () => {
  const {isAuthenticated, loading, user, setUser} = useAuth();

  if(loading){
    return <div>Loading...</div>
  }

  if(!isAuthenticated || !user){
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    setUser(null);
    window.location.href = '/logout';
  }

  return (
    <div className="text-center mt-2">
      {user?.name} : {user?.email}
      <div>
   <Button
      onClick={handleLogout}
      variant="contained"
      color="error"
      startIcon={<LogoutIcon />}
      sx={{ borderRadius: 2 }} // ~ rounded
    >
      Logout
    </Button>
      </div>
    </div>

  )
}
