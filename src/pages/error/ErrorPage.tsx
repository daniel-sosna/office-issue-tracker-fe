import type { FC } from "react";
import {
  useRouteError,
  isRouteErrorResponse,
  Link as RouterLink,
} from "react-router-dom";
import { Box, Stack, Typography, Button } from "@mui/material";

export const ErrorPage: FC = () => {
  const error = useRouteError();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  const title = is404 ? "404 – Page Not Found" : "An unexpected error occurred";
  const mainText = is404
    ? "The page you're looking for does not exist or has been removed."
    : "Sorry, something went wrong. Try refreshing the page. If the problem persists, please notify the system administrator.";

  return (
    <Box sx={{ maxWidth: 640, mt: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          {title}
        </Typography>

        <Typography variant="body1">{mainText}</Typography>

        <Box sx={{ pt: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            component={RouterLink}
            to="/issues"
            sx={{
              bgcolor: "background.paper",
              borderColor: "divider",
              textTransform: "none",
              px: 3,
              py: 1.25,
              borderRadius: 2,
            }}
          >
            Return to Home
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
