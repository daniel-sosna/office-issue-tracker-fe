import { useState } from "react";
import { Box, Typography, Divider, Avatar, Tabs, Tab } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { StatusChip } from "@pages/issues/components/IssueStatusChip";
import type { Issue } from "@data/issues";
import RightDrawer from "@components/RightDrawer";

interface Props {
  issue: Issue | null;
  onClose: () => void;
}

export default function IssueDetailsSidebar({ issue, onClose }: Props) {
  const [selectedTab, setSelectedTab] = useState(0);

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
      <Typography variant="h4" sx={{ fontWeight: 400, mt: 3 }}>
        {issue.title}
      </Typography>

      <Divider sx={{ my: 4 }} />
      <Box mb={2}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "140px 1fr" }}
          gap={2}
          alignItems="center"
        >
          <Box>
            <Typography variant="body2">Reported by</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                borderRadius: 16,
                p: "4px 12px 4px 5px",
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f4f4f4",
              }}
            >
              <Avatar
                alt={issue.reportedBy}
                src="/src/assets/profile_placeholder.jpeg"
                sx={{ width: 20, height: 20, mr: 1 }}
              />
              <Typography variant="body1" color="text.primary">
                {issue.reportedBy}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2">Reported</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.primary">
              {issue.date}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2">Status</Typography>
          </Box>
          <Box>
            <StatusChip status={issue.status} />
          </Box>

          <Box>
            <Typography variant="body2">Upvotes</Typography>
          </Box>
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1,
                py: 0.25,
                borderRadius: 16,
                backgroundColor: "#f4f4f4",
              }}
            >
              <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.primary">
                {issue.votes}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2">Office</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.primary">
              "N/A"
            </Typography>
          </Box>
        </Box>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(_, value: number) => setSelectedTab(value)}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
          "& .MuiTabs-indicator": {
            height: 3,
            backgroundColor: "#78ece8",
            borderRadius: 2,
          },
        }}
      >
        <Tab label="Details" sx={{ textTransform: "none" }} />
        <Tab
          disabled={true}
          label={`Comments (${issue.comments})`}
          sx={{ textTransform: "none" }}
        />
        <Tab
          disabled={true}
          label="Activity log"
          sx={{ textTransform: "none" }}
        />
      </Tabs>

      {selectedTab === 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Description
          </Typography>
          <Typography variant="body1" color="text.primary">
            {issue.description}
          </Typography>
        </Box>
      )}

      {selectedTab === 1 && (
        <Typography variant="body1" color="text.primary">
          Comments section is under construction.
        </Typography>
      )}

      {selectedTab === 2 && (
        <Typography variant="body1" color="text.primary">
          Activity log is under construction.
        </Typography>
      )}
    </RightDrawer>
  );
}
