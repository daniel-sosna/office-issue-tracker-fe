import type { FC } from "react";
import {
  Box,
  Divider,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

const SUPPORT_EMAIL = "office.issue.moderator@gmail.com";

export const Support: FC = () => {
  return (
    <Box sx={{ maxWidth: 900, mt: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Support
        </Typography>

        <Divider />

        <Typography variant="body1" sx={{ pt: 3 }}>
          If you're having any issue related to:
        </Typography>
        <List sx={{ listStyleType: "disc", pl: 3 }}>
          <ListItem sx={{ display: "list-item" }}>Account access</ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Incorrect user information
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Reported issues or comments
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Technical problems or unexpected behavior
          </ListItem>
        </List>
        <Typography variant="body1">
          Please contact the system maintainer for assistance.
        </Typography>

        <Typography variant="h6" component="h2" fontWeight={600}>
          Contact
        </Typography>
        <Typography variant="body1">
          Email: <Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
        </Typography>

        <Typography variant="body1" color="text.secondary">
          This application does not provide real-time support or guaranteed
          response times.
        </Typography>
      </Stack>
    </Box>
  );
};
