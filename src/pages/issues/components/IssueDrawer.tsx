import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Tabs,
  Tab,
  MenuItem,
  Select,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { StatusChip } from "@pages/issues/components/IssueStatusChip";
import type { IssueDetails } from "@data/issues";
import RightDrawer from "@components/RightDrawer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { updateIssue, updateIssueStatus } from "@api/issues";

interface Props {
  issue: IssueDetails | null;
  onClose: () => void;
  canEdit: boolean;
  canEditStatus: boolean;
  onIssueUpdated: (updated: IssueDetails) => void;
}

export default function IssueDetailsSidebar({
  issue,
  onClose,
  canEdit,
  canEditStatus,
  onIssueUpdated,
}: Props) {
  const TabIndex = {
    Details: 0,
    Comments: 1,
    Activity: 2,
  } as const;

  type TabIndex = (typeof TabIndex)[keyof typeof TabIndex];

  const [selectedTab, setSelectedTab] = useState<TabIndex>(TabIndex.Details);

  const [form, setForm] = useState({
    title: issue?.title ?? "",
    description: issue?.description ?? "",
    status: issue?.status ?? "",
    office: issue?.office ?? "",
  });

  useEffect(() => {
    if (issue) {
      setForm({
        title: issue.title,
        description: issue.description,
        status: issue.status,
        office: issue.office,
      });
    }
  }, [issue]);

  async function handleSave() {
    if (!issue) return;

    try {
      const updatedDetails = await updateIssue(issue.id, {
        summary: form.title,
        description: form.description,
        officeId: form.office,
      });

      let finalIssue = updatedDetails;

      if (canEditStatus && form.status !== issue.status) {
        finalIssue = await updateIssueStatus(issue.id, form.status);
      }

      onIssueUpdated(finalIssue);
    } catch (err) {
      console.error("Failed to save issue:", err);
    }
  }
  function handleCancel() {
    if (!issue) return;
    setForm({
      title: issue.title,
      description: issue.description,
      status: issue.status,
      office: issue.office,
    });
  }

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        mb={1}
      >
        <TextField
          variant="standard"
          fullWidth
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          InputProps={{
            readOnly: !canEdit,
            sx: {
              fontSize: "22px",
              fontWeight: 400,
            },
          }}
        />
      </Box>

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
                src={issue.reportedByAvatar}
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
            {canEditStatus ? (
              <Select
                size="small"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="IN_PROGRESS">In progress</MenuItem>
                <MenuItem value="BLOCKED">Blocked</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
              </Select>
            ) : (
              <StatusChip status={issue.status} />
            )}
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
            {canEdit ? (
              <Select
                size="small"
                value={form.office}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, office: e.target.value }))
                }
              >
                <MenuItem value="Vilnius">Vilnius</MenuItem>
                <MenuItem value="Kaunas">Kaunas</MenuItem>
                <MenuItem value="Krakow">Krakow</MenuItem>
              </Select>
            ) : (
              <Typography>{issue.office}</Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(_, value: TabIndex) => setSelectedTab(value)}
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

      {selectedTab === TabIndex.Details && (
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Description
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={4}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            InputProps={{
              readOnly: !canEdit,
            }}
          />
        </Box>
      )}

      {selectedTab === TabIndex.Comments && (
        <Typography variant="body1" color="text.primary">
          Comments section is under construction.
        </Typography>
      )}

      {selectedTab === TabIndex.Activity && (
        <Typography variant="body1" color="text.primary">
          Activity log is under construction.
        </Typography>
      )}

      <Divider sx={{ my: 4, mt: 50 }} />

      <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
        <Button variant="outlined" size="small" onClick={handleCancel}>
          Cancel
        </Button>

        <Button
          variant="contained"
          size="medium"
          color="secondary"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </RightDrawer>
  );
}
