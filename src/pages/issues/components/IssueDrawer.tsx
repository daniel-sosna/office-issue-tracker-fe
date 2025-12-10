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
  Alert,
  Snackbar,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { StatusChip } from "@pages/issues/components/IssueStatusChip";
import type { IssueDetails, IssueStatusType } from "@data/issues";
import RightDrawer from "@components/RightDrawer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  deleteIssue,
  fetchIssueDetails,
  updateIssue,
  updateIssueStatus,
} from "@api/issues.ts";
import { fetchOffices } from "@api/offices";
import { stripHtmlDescription, formatDate } from "@utils/formatters.ts";

interface Office {
  id: string;
  title: string;
  country: string;
}
interface Props {
  issue: IssueDetails | null;
  onClose: () => void;
  issueOwner: boolean;
  admin: boolean;
  onIssueUpdated: (updated: IssueDetails) => void;
  onIssueDeleted: (deletedId: string) => void;
}

export default function IssueDetailsSidebar({
  issue,
  onClose,
  issueOwner,
  admin,
  onIssueUpdated,
  onIssueDeleted,
}: Props) {
  const TabIndex = {
    Details: 0,
    Comments: 1,
    Activity: 2,
  } as const;

  type TabIndex = (typeof TabIndex)[keyof typeof TabIndex];

  const [selectedTab, setSelectedTab] = useState<TabIndex>(TabIndex.Details);
  const [deleting, setDeleting] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [editingOffice, setEditingOffice] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    summary?: string;
    description?: string;
  }>({});

  const [form, setForm] = useState<{
    summary: string;
    description: string;
    status: IssueStatusType | "";
    officeId: string;
  }>({
    summary: "",
    description: "",
    status: "",
    officeId: "",
  });

  useEffect(() => {
    const loadOffices = async () => {
      try {
        const data = await fetchOffices();
        setOffices(data);
      } catch (err) {
        console.error("Failed to load offices:", err);
      }
    };

    void loadOffices();
  }, []);

  useEffect(() => {
    if (issue) {
      setForm({
        summary: issue.summary,
        description: stripHtmlDescription(issue.description),
        status: issue.status,
        officeId: issue.officeId || "",
      });
    }
  }, [issue]);

  function validateForm() {
    const newErrors: typeof errors = {};

    if (!form.summary || form.summary.trim().length === 0) {
      newErrors.summary = "Summary is required";
    } else if (form.summary.trim().length < 3) {
      newErrors.summary = "Summary must be at least 3 characters";
    } else if (form.summary.length > 200) {
      newErrors.summary = "Summary must be less than 200 characters";
    }

    if (!form.description || form.description.trim().length === 0) {
      newErrors.description = "Description is required";
    } else if (form.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!issue) return;
    if (!validateForm()) return;

    try {
      if (issueOwner) {
        const payload = {
          summary: form.summary,
          description: `<p>${form.description.replace(/\n/g, "</p><p>")}</p>`,
          officeId: form.officeId || issue.officeId,
        };

        await updateIssue(issue.id, payload);
      }

      if (admin && form.status !== issue.status) {
        await updateIssueStatus(issue.id, form.status);
      }
      const refreshedIssue = await fetchIssueDetails(issue.id);
      onIssueUpdated(refreshedIssue);
      setSaveSuccess(true);
    } catch (err) {
      console.error("Failed to save issue:", err);
    }
  }

  function handleCancel() {
    if (!issue) return;
    setForm({
      summary: issue.summary,
      description: stripHtmlDescription(issue.description),
      status: issue.status,
      officeId: issue.officeId,
    });
  }
  const handleDelete = async () => {
    if (!issue) return;
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this issue? This action cannot be undone."
    );
    if (!deleteConfirmation) return;
    try {
      setDeleting(true);

      await deleteIssue(issue.id);

      onIssueDeleted(issue.id);

      onClose();
    } catch (err) {
      console.error("Failed to delete issue:", err);
      alert("Failed to delete issue. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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
        sx={{ display: "flex", flexDirection: "column", minHeight: "92.5vh" }}
      >
        <Box sx={{ flex: 1, overflowY: "auto" }}>
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
              value={form.summary}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, summary: e.target.value }))
              }
              error={!!errors.summary}
              helperText={errors.summary}
              slotProps={{
                input: {
                  readOnly: !issueOwner,
                  sx: {
                    fontSize: "22px",
                    fontWeight: 400,
                  },
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
                    alt={issue.reportedBy ?? "Unknown user"}
                    src={issue.reportedByAvatar || undefined}
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
                  {formatDate(issue.dateCreated)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2">Status</Typography>
              </Box>
              <Box>
                {admin ? (
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

              <Box display="flex" alignItems="center" gap={1}>
                {!editingOffice && (
                  <>
                    <Typography>{issue.office}</Typography>
                    {(issueOwner || admin) && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setEditingOffice(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </>
                )}

                {editingOffice && (issueOwner || admin) && (
                  <>
                    <Select
                      size="small"
                      value={form.officeId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          officeId: e.target.value,
                        }))
                      }
                      sx={{ minWidth: 160 }}
                    >
                      {offices.map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                          {o.title}, {o.country}
                        </MenuItem>
                      ))}
                    </Select>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditingOffice(false)}
                    >
                      Done
                    </Button>
                  </>
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
              {issueOwner ? (
                <TextField
                  multiline
                  fullWidth
                  minRows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  error={!!errors.description}
                  helperText={errors.description}
                />
              ) : (
                <Box
                  sx={{
                    border: "1px solid #eee",
                    borderRadius: 1,
                    padding: 2,
                    backgroundColor: "#fafafa",
                    minHeight: "120px",
                  }}
                >
                  {stripHtmlDescription(issue.description)}
                </Box>
              )}
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
        </Box>

        <Divider sx={{ mt: 4 }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={4}
        >
          <Box>
            {(issueOwner || admin) && (
              <Button
                variant="outlined"
                size="medium"
                onClick={() => void handleDelete()}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </Box>

          <Box display="flex" gap={2}>
            {(issueOwner || admin) && (
              <>
                <Button variant="outlined" size="medium" onClick={handleCancel}>
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  size="medium"
                  color="secondary"
                  onClick={() => void handleSave()}
                >
                  Save
                </Button>
              </>
            )}
            <Snackbar
              open={saveSuccess}
              autoHideDuration={3000}
              onClose={() => setSaveSuccess(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert
                onClose={() => setSaveSuccess(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                Issue saved successfully!
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Box>
    </RightDrawer>
  );
}
