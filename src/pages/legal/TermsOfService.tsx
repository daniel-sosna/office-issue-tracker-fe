import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Divider,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

export const TermsOfService: FC = () => {
  return (
    <Box sx={{ maxWidth: 900, mt: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Terms of Service
        </Typography>

        <Typography variant="body1">
          This application is provided on an “as is” basis for internal use.
        </Typography>

        <Divider />

        <Typography variant="h6" component="h2" fontWeight={600}>
          1. Acceptable use
        </Typography>
        <Typography variant="body1">
          By using the application, you agree to:
        </Typography>
        <List sx={{ listStyleType: "disc", pl: 3 }}>
          <ListItem sx={{ display: "list-item" }}>
            Use it only for its intended purpose
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Provide accurate and appropriate information
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Avoid misuse, abuse, or disruption of the system
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Avoid uploading sensitive personal data, secrets, or illegal content
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" fontWeight={600}>
          2. Administrator actions
        </Typography>
        <Typography variant="body1">
          Administrators have elevated privileges and may:
        </Typography>
        <List sx={{ listStyleType: "disc", pl: 3 }}>
          <ListItem sx={{ display: "list-item" }}>Delete any issue</ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Change issue status or associated office
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Manage content to ensure proper system operation
          </ListItem>
        </List>

        <Typography variant="h6" component="h2" fontWeight={600}>
          3. Content responsibility
        </Typography>
        <Typography variant="body1">
          All users are responsible for the content they submit, including
          reported issues and any comments.
        </Typography>

        <Typography variant="h6" component="h2" fontWeight={600}>
          4. Availability and changes
        </Typography>
        <Typography variant="body1">
          We make no guarantees regarding availability, accuracy, or
          uninterrupted operation of the service. We reserve the right to modify
          or discontinue the application at any time without notice.
        </Typography>

        <Typography variant="h6" component="h2" fontWeight={600}>
          5. Contact
        </Typography>
        <Typography variant="body1">
          Questions? See the{" "}
          <Link component={RouterLink} to="/support">
            Support
          </Link>{" "}
          page.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          By using this application, you consent to these Terms of Service.
        </Typography>
      </Stack>
    </Box>
  );
};
