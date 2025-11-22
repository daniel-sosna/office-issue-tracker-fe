import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";

const Sidebar: React.FC = () => {
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "home", label: "Home", icon: <HomeIcon /> },
    { id: "profile", label: "My profile", icon: <PersonIcon /> },
  ];

  return (
    <Box
      sx={{
        width: "90px",
        bgcolor: "#fff",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <Avatar
        src="/src/assets/Cognizant_Logo.jpeg"
        alt="Logo"
        sx={{
          width: 50,
          height: 50,
          mb: 5,
        }}
      />

      <List
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            sx={{
              flexDirection: "column",
              alignItems: "center",
              color: active === item.id ? "#0b0b56" : "#1d2088",
              transition: "all 0.3s ease",
            }}
          >
            <IconButton
              onClick={() => setActive(item.id)}
              sx={{
                background:
                  active === item.id
                    ? "linear-gradient(135deg, #318CE7, #BAF8F8)"
                    : "transparent",

                borderRadius: "12px",
                width: 38,
                height: 38,
                "&:hover": {
                  background: "linear-gradient(135deg, #e4e7ff, #f0f4ff)",
                },
                color: active === item.id ? "#0b0b56" : "#1d2088",
              }}
            >
              {item.icon}
            </IconButton>

            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8rem",
                mt: 1,
                fontWeight: 500,
                color: "#0b0b56",
              }}
            >
              {item.label}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
