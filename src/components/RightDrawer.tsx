import { type ReactNode } from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function RightDrawer({ open, onClose, children }: Props) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 500 },
            p: 1,
          },
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="end" gap={1}>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close sidebar"
          title="Close"
        >
          <CloseIcon color="secondary" />
        </IconButton>
      </Box>

      <Box p={3} display="flex" flexDirection="column" height="100%">
        {children}
      </Box>
    </Drawer>
  );
}
