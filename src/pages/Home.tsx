import { Navigate, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "@context/AuthContext";
import { Avatar, Stack } from "@mui/material";
import { csrfFetch } from "@utils/csrfFetch";


export const Home = () => {
  const { isAuthenticated, loading, user, setUser } = useAuth();
   const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

const handleLogout = async () => {
  try {
    await csrfFetch("/logout", {
      method: "POST",
    });
  } catch (_) {
  } finally {
    setUser(null);
    navigate("/login", { replace: true });
  }
};
 
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
