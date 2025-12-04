import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    status: {
      openBg: string;
      inProgressBg: string;
      resolvedBg: string;
      closedBg: string;
      pendingBg: string;
      blockedBg: string;
      mainText: string;
      mutedText: string;
    };
  }

  interface PaletteOptions {
    status?: {
      openBg?: string;
      inProgressBg?: string;
      resolvedBg?: string;
      closedBg?: string;
      pendingBg?: string;
      blockedBg?: string;
      mainText?: string;
      mutedText?: string;
    };
  }
}
