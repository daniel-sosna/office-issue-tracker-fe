import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { csrfFetch } from "@utils/csrfFetch";
import { useAuth } from "@context/use-auth";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import IssueModal from "@pages/issues/IssueModal";

export const Home = () => {
  const { isAuthenticated, loading, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await csrfFetch("/logout", {
        method: "POST",
      });
    } catch (error) {
      reportError(error);
    } finally {
      setUser(null);
      void navigate("/login", { replace: true });
    }
  };

  const handleReportSubmit = (data: {
    summary: string;
    description: string;
    office: string;
  }) => {
    console.log("Reported issue:", data);
    setModalOpen(false);
  };

  const picture = user?.picture ?? "/images/default.png";

  return (
    <div>
      <Stack>
        <Avatar alt={user.name} src={picture} sx={{ width: 80, height: 80 }} />
      </Stack>
      {user?.name} : {user?.email}
      <div>
        <Button
          onClick={() => void handleLogout()}
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>

        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Report Issue
        </Button>
      </div>
      <IssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};
