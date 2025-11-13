import { Navigate } from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "@context/AuthContext";
import { Avatar, Stack } from "@mui/material";

export const Home = () => {
  const { isAuthenticated, loading, user, setUser } = useAuth();

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    setUser(null);
    window.location.href = '/logout';
  }

  const picture = user?.picture || "/images/default.png";

  return (
    <div>
      <Stack>
        <Avatar
          alt={user.name}
          src={picture}
          sx={{ width: 80, height: 80 }}
        />
      </Stack>
      {user?.name} : {user?.email}
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
