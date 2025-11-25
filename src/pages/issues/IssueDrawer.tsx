import { Box, Typography, Divider, Avatar } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import type { Issue } from "@data/issues";
import RightDrawer from "./RightDrawer";

interface Props {
  issue: Issue | null;
  onClose: () => void;
}

export default function IssueDetailsSidebar({ issue, onClose }: Props) {
  if (!issue) {
    return (
      <RightDrawer open={false} onClose={onClose}>
        <Typography variant="h4" sx={{ fontWeight: 400 }}>
          Select an issue to see details.
        </Typography>
      </RightDrawer>
    );
  }

  return (
    <RightDrawer open={true} onClose={onClose}>
      <Typography variant="h4" sx={{ fontWeight: 400 }}>
        {issue.title}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
        <Typography variant="body1" color="text.primary" mb={2}>
          {issue.description}
        </Typography>

        <Box display="flex" gap={2} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <ArrowUpwardIcon sx={{ color: "primary.main" }} />
            <Typography variant="body2" fontWeight={600}>
              {issue.votes}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <ChatBubbleOutlineIcon />
            <Typography variant="body2">{issue.comments} comments</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Avatar sx={{ width: 36, height: 36 }}>
            {issue.reportedBy?.[0] ?? "U"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">Reported by</Typography>
            <Typography variant="body2" color="text.secondary">
              {issue.reportedBy}
            </Typography>
          </Box>
        </Box>
      </Box>
    </RightDrawer>
  );
}
