import { type ReactNode } from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

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
            width: { xs: "100%", sm: 650 },
            p: 1,
          },
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="end" gap={1}>
        <IconButton
          sx={{ display: "none" }}
          size="small"
          aria-label="expand"
          title="Expand"
        >
          <OpenInFullIcon fontSize="small" color="secondary" />
        </IconButton>

        <IconButton
          sx={{ display: "none" }}
          size="small"
          aria-label="more"
          title="More options"
        >
          <MoreVertIcon fontSize="small" color="secondary" />
        </IconButton>
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
