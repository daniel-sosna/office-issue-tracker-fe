import React from "react";
import { Box, Typography, Link } from "@mui/material";

type FooterVariant = "unauthenticated" | "authenticated";

interface FooterProps {
  variant?: FooterVariant;
}

const Footer: React.FC<FooterProps> = ({ variant = "unauthenticated" }) => {
  const isAuthenticated = variant === "authenticated";

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: isAuthenticated ? "space-between" : "center",
        alignItems: "center",
        px: 5,
        py: 2,
        fontSize: "0.85rem",
        color: "text.secondary",
        bgcolor: "background.paper",
        borderTop: isAuthenticated ? 1 : 0,
        borderColor: isAuthenticated ? "divider" : "transparent",
      }}
    >
      {isAuthenticated ? (
        <>
          <Typography variant="body2">Copyright © 2025 Cognizant</Typography>
          <Link href="#" underline="hover" sx={{ color: "text.secondary" }}>
            Privacy policy
          </Link>
        </>
      ) : (
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
      )}
    </Box>
  );
};

export default Footer;
