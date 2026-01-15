import type { FC } from "react";
import { Box, Divider, List, ListItem, Stack, Typography } from "@mui/material";

export const PrivacyPolicy: FC = () => {
  return (
    <Box sx={{ maxWidth: 900, mt: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Privacy Policy
        </Typography>

        <Typography variant="body1">
          This application is intended for internal use.
        </Typography>

        <Divider />

        <Typography variant="body1">
          We collect and store only the information necessary to operate the
          service. Authentication is performed via Google Sign-In; we do not
          store user passwords.
        </Typography>

        <Typography variant="h6" component="h2" fontWeight={600}>
          1. What we may collect
        </Typography>
        <List sx={{ listStyleType: "disc", pl: 3 }}>
          <ListItem sx={{ display: "list-item" }}>
            Name, email address, and profile picture URL from Google account
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Department, role, and address (if provided)
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Activity related to issues, comments, and votes
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" fontWeight={600}>
          2. How we use data
        </Typography>
        <Typography variant="body1">
          Collected data is used solely to:
        </Typography>
        <List sx={{ listStyleType: "disc", pl: 3 }}>
          <ListItem sx={{ display: "list-item" }}>
            Identify users within the system
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Associate issues, comments, and votes with users
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Manage issue visibility, ownership, and status
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" fontWeight={600}>
          3. Important notes
        </Typography>
        <Typography variant="body1">
          Issues may be soft deleted, meaning they are hidden but retained in
          the system for administrative purposes.
        </Typography>
        <Typography variant="body1">
          User accounts cannot be deleted through the user interface. Account
          removal may be performed manually by a system maintainer if required.
        </Typography>

        <Typography variant="h6" component="h2" fontWeight={600}>
          4. Sharing and guarantees
        </Typography>
        <Typography variant="body1">
          We do not sell, share, or distribute personal data to third parties.
          This application is provided without guarantees regarding data
          retention, availability, or security.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          By using this application, you consent to this Privacy Policy.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Last updated: 2026-01-10
        </Typography>
      </Stack>
    </Box>
  );
};
