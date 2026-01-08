import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    vote: {
      active: string;
      activeBg: string;
      inactive: string;
      inactiveBg: string;
      hover: {
        activeBg: string;
        inactiveBg: string;
      };
    };
  }

  interface PaletteOptions {
    vote?: {
      active?: string;
      activeBg?: string;
      inactive?: string;
      inactiveBg?: string;
      hover?: {
        activeBg?: string;
        inactiveBg?: string;
      };
    };
  }
}
