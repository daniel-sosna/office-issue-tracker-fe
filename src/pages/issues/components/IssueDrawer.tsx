import { useCallback, useEffect, useRef, useState } from "react";
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
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { StatusChip } from "@pages/issues/components/IssueStatusChip";
import type { IssueStats, IssueStatusType } from "@data/issues";
import RightDrawer from "@components/RightDrawer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  softDeleteIssue,
  updateIssue,
  updateIssueStatus,
} from "@api/services/issues";
import { stripHtmlDescription, formatDate } from "@utils/formatters";
import { useOffices } from "@api/queries/useOffices";
import theme from "@styles/theme";
import { useIssueDetails } from "@api/queries/useIssueDetails";
import { useAuth } from "@context/UseAuth";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";

interface Props {
  issueId?: string;
  issueStats?: IssueStats;
  onClose: () => void;
  admin: boolean;
  onSaved: () => void;
  onError: (message: string) => void;
}

export default function IssueDetailsSidebar({
  issueId,
  issueStats = { hasVoted: false, votes: 0, comments: 0 },
  onClose,
  admin,
  onSaved,
  onError,
}: Props) {
  const TabIndex = {
    Details: 0,
    Comments: 1,
    Activity: 2,
  } as const;

  type TabIndex = (typeof TabIndex)[keyof typeof TabIndex];

  const [selectedTab, setSelectedTab] = useState<TabIndex>(TabIndex.Details);
  const [deleting, setDeleting] = useState(false);
  const { data: issue } = useIssueDetails(issueId, issueStats);
  const { data: offices = [], isError: officesError } = useOffices();
  const { user } = useAuth();
  const issueOwner = issue && issue.reportedByEmail === user?.email;
  const queryClient = useQueryClient();
  const [editingField, setEditingField] = useState<
    null | "summary" | "description" | "office" | "status"
  >(null);
  const [errors, setErrors] = useState<{
    summary?: string;
    description?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<{
    summary: string;
    description: string;
    status: IssueStatusType;
    officeId: string;
  }>({
    summary: "",
    description: "",
    status: "OPEN",
    officeId: "",
  });

  const summaryRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const officeRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!editingField) return;

      const target = event.target as HTMLElement;

      if (actionsRef.current?.contains(target)) {
        return;
      }

      if (target.closest(".MuiMenu-paper")) {
        return;
      }

      const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
        summary: summaryRef,
        description: descriptionRef,
        status: statusRef,
        office: officeRef,
      };

      const activeRef = refs[editingField];
      if (activeRef?.current && !activeRef.current.contains(target)) {
        setEditingField(null);
      }
    },
    [editingField]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (officesError) {
      setErrorMessage("Failed to load offices.");
    }
  }, [officesError]);

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

    const isValid = Object.keys(newErrors).length === 0;
    setErrors(newErrors);
    return isValid;
  }

  async function handleSave() {
    if (!issue) return;
    if (!validateForm()) {
      return;
    }

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
      if (
        (issueOwner || admin) &&
        form.officeId &&
        form.officeId !== issue.officeId
      ) {
        await updateIssue(issue.id, { officeId: form.officeId });
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.issues(),
      });
      setEditingField(null);
      onSaved();
      onClose();
    } catch {
      onError("Failed to save the Issue.");
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
    setEditingField(null);
    onClose();
  }

  const handleDelete = async () => {
    if (!issue) return;
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this issue? This action cannot be undone."
    );
    if (!deleteConfirmation) return;
    try {
      setDeleting(true);

      await softDeleteIssue(issue.id);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.issues(),
      });

      onClose();
    } catch {
      setErrorMessage("Failed to delete the issue.");
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
    <RightDrawer open={!!issueId} onClose={handleCancel}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "92.5vh" }}
      >
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Box
            ref={summaryRef}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
            mb={1}
          >
            {editingField !== "summary" && (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: "22px",
                    fontWeight: 400,
                    lineHeight: "1.3",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {form.summary}
                </Typography>

                {issueOwner && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingField("summary");
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </>
            )}

            {editingField === "summary" && issueOwner && (
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
                    sx: {
                      fontSize: "22px",
                      fontWeight: 400,
                    },
                  },
                }}
              />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

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
              <Box ref={statusRef}>
                <Box>
                  {editingField !== "status" && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <StatusChip status={form.status} />
                      {admin && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingField("status");
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  )}

                  {editingField === "status" && admin && (
                    <Select
                      size="small"
                      value={form.status}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }));
                      }}
                      sx={{ minWidth: 160 }}
                    >
                      <MenuItem value="OPEN">Open</MenuItem>
                      <MenuItem value="IN_PROGRESS">In progress</MenuItem>
                      <MenuItem value="BLOCKED">Blocked</MenuItem>
                      <MenuItem value="RESOLVED">Resolved</MenuItem>
                      <MenuItem value="CLOSED">Closed</MenuItem>
                    </Select>
                  )}
                </Box>
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
                    backgroundColor: issueStats.hasVoted
                      ? "vote.activeBg"
                      : "#f4f4f4",
                  }}
                >
                  <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.primary">
                    {issueStats.votes}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2">Office</Typography>
              </Box>

              <Box ref={officeRef} display="flex" alignItems="center" gap={1}>
                {editingField !== "office" && (
                  <>
                    <Typography>
                      {(() => {
                        const selectedOffice = offices.find(
                          (o) =>
                            o.id === form.officeId || o.id === issue.officeId
                        );
                        return selectedOffice
                          ? `${selectedOffice.title}, ${selectedOffice.country}`
                          : issue.office;
                      })()}
                    </Typography>
                    {
                      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                      (issueOwner || admin) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingField("office");
                          }}
                          sx={{ padding: "4px" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  </>
                )}

                {
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  editingField === "office" && (issueOwner || admin) && (
                    <Select
                      size="small"
                      value={form.officeId || issue.officeId}
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
                  )
                }
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
          </Tabs>

          {selectedTab === TabIndex.Details && (
            <Box ref={descriptionRef}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Description
              </Typography>
              {editingField !== "description" && (
                <Box
                  sx={{
                    padding: 2,
                    minHeight: "60px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      flexGrow: 1,
                      maxWidth: "auto",
                    }}
                  >
                    {form.description}
                  </Typography>

                  {issueOwner && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingField("description");
                      }}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              )}
              {editingField === "description" && issueOwner && (
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
            {
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              (issueOwner || admin) && (
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => void handleDelete()}
                  sx={{
                    borderRadius: "999px",
                    paddingX: 3,
                    backgroundColor: theme.palette.status.blockedBg,
                  }}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              )
            }
          </Box>

          <Box ref={actionsRef} display="flex" gap={2}>
            {
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              (issueOwner || admin) && (
                <>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleCancel}
                    sx={{
                      borderRadius: "999px",
                      paddingX: 3,
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    size="medium"
                    color="secondary"
                    onClick={() => void handleSave()}
                    sx={{
                      borderRadius: "999px",
                      paddingX: 3,
                    }}
                  >
                    Save
                  </Button>
                </>
              )
            }
            <Snackbar
              open={!!errorMessage}
              autoHideDuration={4000}
              onClose={() => setErrorMessage(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert
                severity="error"
                onClose={() => setErrorMessage(null)}
                sx={{ width: "100%" }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Box>
    </RightDrawer>
  );
}
