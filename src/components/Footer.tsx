import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 5,
        py: 2,
        fontSize: "0.85rem",
        color: "text.secondary",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="body2">© 2023 Cognizant</Typography>
      <Link href="#" underline="hover" sx={{ color: "text.secondary" }}>
        Privacy policy
      </Link>
    </Box>
  );
};

export default Footer;
