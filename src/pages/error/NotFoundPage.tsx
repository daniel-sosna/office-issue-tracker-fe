import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Stack, Typography, Button } from "@mui/material";

export const NotFoundPage: FC = () => {
  return (
    <Box sx={{ maxWidth: 640, mt: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          404 – Page Not Found
        </Typography>

        <Typography variant="body1">
          The page you're looking for does not exist or has been removed.
        </Typography>

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
