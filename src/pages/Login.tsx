import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@context/Use-auth";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export const Login = () => {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  interface LocationState {
    form?: {
      pathname: string;
    };
  }

  const location = useLocation() as LocationState;

  const fromLocation = location.form?.pathname ?? "/";

  useEffect(() => {
    if (isAuthenticated) {
      void navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, fromLocation, navigate]);

  const handleLogin = (provider: string) => {
    if (provider == "google") {
      window.location.href = "/oauth2/authorization/google";
    } else return;
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Stack spacing={4} alignItems="center">
        <Typography variant="h5">
          Welcome to Defect Registration System
        </Typography>

        <Button
          variant="outlined"
          color="inherit"
          onClick={() => handleLogin("google")}
          startIcon={
            <Box
              component="img"
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              sx={{ width: 20, height: 20 }}
            />
          }
          sx={{
            bgcolor: "background.paper",
            borderColor: "divider",
            textTransform: "none",
            px: 3,
            py: 1.25,
            borderRadius: 2,
          }}
        >
          Sign in with Google
        </Button>
      </Stack>
    </Box>
  );
};
