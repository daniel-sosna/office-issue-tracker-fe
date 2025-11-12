import { Navigate } from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../../context/AuthContext";

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

const picture = user?.picture || "/images/default.png";

  return (
    <div className="text-center mt-2">
      {user?.name} : {user?.email}
      <img
          src={picture}
          alt={user?.name || "User"}
          width={96}
          height={96}
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = "/images/default.png"; }}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      <div>
   <Button
      onClick={handleLogout}
      variant="contained"
      color="error"
      startIcon={<LogoutIcon />}
      sx={{ borderRadius: 2 }}
    >
      Logout
    </Button>
      </div>
    </div>

  )
}
