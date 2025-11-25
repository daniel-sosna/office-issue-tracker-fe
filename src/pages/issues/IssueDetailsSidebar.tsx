import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import type { Issue } from "@data/issues";

interface Props {
  open: boolean;
  issue: Issue | null;
  onClose: () => void;
}

export default function IssueDetailsSidebar({ open, issue, onClose }: Props) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 650 },
          p: 1,
        },
      }}
    >
      {/* Top buttons */}
      <Box display="flex" alignItems="center" justifyContent="end" gap={2}>
        <Box display="flex" gap={1} alignItems="center">
          <IconButton size="small" aria-label="expand" title="Expand">
            <OpenInFullIcon fontSize="small" color="secondary" />
          </IconButton>
          <IconButton size="small" aria-label="more" title="More options">
            <MoreVertIcon fontSize="small" color="secondary" />
          </IconButton>
          <IconButton
            onClick={onClose}
            aria-label="close sidebar"
            title="Close"
          >
            <CloseIcon color="secondary" />
          </IconButton>
        </Box>
      </Box>

      <Box p={3}>
        <Typography variant="h4" sx={{ fontWeight: 400 }}>
          {issue ? issue.title : "Select an issue to see details."}
        </Typography>

        <Divider sx={{ my: 2 }} />
      </Box>
    </Drawer>
  );
}
