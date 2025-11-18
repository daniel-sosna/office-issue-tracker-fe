import React from "react";
import { AppBar, Toolbar, IconButton, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Header: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e6e8eb",
        color: "midnightblue",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <Avatar
          alt="User"
          src="/src/assets/profile_placeholder.jpeg"
          sx={{ width: 36, height: 36, ml: 1 }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
