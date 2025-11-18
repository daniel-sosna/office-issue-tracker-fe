import { createTheme } from "@mui/material/styles";

const headerStyle = { color: "#000048", fontWeight: 600 };

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#f9fafb", paper: "#ffffff" },
    primary: { main: "#0a0a23" },
    secondary: { main: "#000048" },
    text: { primary: "#000048", secondary: "#5f6368" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: headerStyle,
    h2: headerStyle,
    h3: headerStyle,
    h4: headerStyle,
    h5: headerStyle,
    h6: headerStyle,
    subtitle1: headerStyle,
    body1: { color: "#5f6368", fontWeight: 400 },
    body2: { color: "#5f6368", fontWeight: 400 },
    button: { textTransform: "none" },
  },
});

export default theme;
