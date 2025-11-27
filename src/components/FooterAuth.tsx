import React from "react";
import { Box, Typography, Link } from "@mui/material";

const FooterAuth: React.FC = () => (
  <Box
    component="footer"
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      px: 5,
      py: 2,
      fontSize: "0.85rem",
      color: "text.secondary",
      bgcolor: "background.paper",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Link href="#" underline="hover" sx={{ color: "text.secondary" }}>
        Terms of Service
      </Link>
      <Typography variant="body2" component="span">
        |
      </Typography>
      <Link href="#" underline="hover" sx={{ color: "text.secondary" }}>
        Support
      </Link>
      <Typography variant="body2" component="span">
        |
      </Typography>
      <Typography variant="body2" component="span">
        © 2025 Cognizant
      </Typography>
    </Box>
  </Box>
);

export default FooterAuth;
