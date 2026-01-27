import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "@context/UseAuth";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    void navigate("/login", { replace: true });
  };

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

        <IconButton
          onClick={handleAvatarClick}
          size="small"
          aria-controls={open ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ ml: 1 }}
        >
          <Avatar
            alt="User"
            src={user?.picture}
            sx={{ width: 36, height: 36 }}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          id="user-menu"
          open={open}
          disableScrollLock
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => void navigate("/profile")}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider variant="middle" />
          <MenuItem onClick={() => void handleLogout()}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
