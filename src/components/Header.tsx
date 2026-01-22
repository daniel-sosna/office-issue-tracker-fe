import React, { useState } from "react";
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
  Badge,
  Typography,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "@context/UseAuth";
import {
  useUnreadNotificationCount,
  useMarkAllAsRead,
  useMarkSingleAsRead,
  useNotifications,
} from "@api/queries/useNotifications";
import { useNotificationSocket } from "@api/queries/useNotificationSocket";
import { formatDate } from "@utils/formatters";

const NOTIF_LIMIT = 10;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Avatar menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Notifications menu state
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const notifOpen = Boolean(notifAnchor);
  const handleNotifClick = (e: React.MouseEvent<HTMLElement>) =>
    setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const [limit, setLimit] = useState(NOTIF_LIMIT);

  // Notifications queries
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadNotificationCount();
  const markAll = useMarkAllAsRead();
  const markSingle = useMarkSingleAsRead();

  useNotificationSocket(user?.id ?? "");

  const paginatedNotifications = notifications?.slice(0, limit) ?? [];

  const loadMore = () => {
    setLimit((prev) => prev + NOTIF_LIMIT);
  };

  const handleLogout = async () => {
    try {
      await logout();
      await navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
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
        <IconButton color="inherit" onClick={handleNotifClick}>
          <Badge badgeContent={unreadCount ?? 0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchor}
          open={notifOpen}
          onClose={handleNotifClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                width: 420,
                maxWidth: "95vw",
                mt: 1,
                borderRadius: 2,
              },
            },
            list: { sx: { p: 0 } },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2.5,
              py: 1.5,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
            {notifications && notifications.length > 0 && (
              <Button
                size="small"
                onClick={() => markAll.mutate()}
                variant="text"
                sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1 }}
              >
                Mark all read
              </Button>
            )}
          </Box>

          {/* Notifications List */}
          <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
            {paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((n, idx) => (
                <React.Fragment key={n.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      backgroundColor: n.readFlag ? "#fff" : "#e3f2fd",
                      width: "100%",
                      px: 2,
                      py: 1.25,
                      cursor: "default",
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: n.readFlag ? 400 : 600 }}
                      >
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(n.createdAt)}
                      </Typography>
                    </Box>

                    {!n.readFlag && (
                      <Tooltip title="Mark as read">
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            markSingle.mutate(n.id);
                          }}
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "#1976d2",
                            cursor: "pointer",
                            mt: 0.8,
                            ml: 1.5,
                            flexShrink: 0,
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  {idx < paginatedNotifications.length - 1 && (
                    <Divider sx={{ m: 0 }} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <MenuItem disabled sx={{ p: 1 }}>
                <Typography variant="body2">No notifications</Typography>
              </MenuItem>
            )}

            {notifications &&
              notifications.length > paginatedNotifications.length && (
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <Button size="small" onClick={loadMore} variant="text">
                    Load more
                  </Button>
                </Box>
              )}
          </Box>
        </Menu>

        <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 1 }}>
          <Avatar
            alt="User"
            src={user?.picture ?? "/src/assets/profile_placeholder.jpeg"}
            sx={{ width: 36, height: 36 }}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          id="user-menu"
          open={open}
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
