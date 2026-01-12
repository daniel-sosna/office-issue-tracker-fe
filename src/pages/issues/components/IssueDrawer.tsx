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
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import theme from "@styles/theme";
import { useQueryClient } from "@tanstack/react-query";
import {
  deleteAttachment,
  softDeleteIssue,
  updateIssue,
  updateIssueStatus,
} from "@api/services/issues";
import { queryKeys } from "@api/queries/queryKeys";
import { useIssueDetails } from "@api/queries/useIssueDetails";
import { useOffices } from "@api/queries/useOffices";
import RightDrawer from "@components/RightDrawer";
import type { User } from "@context/AuthContext";
import {
  IssueStatus,
  type IssueAttachment,
  type IssueStats,
  type IssueStatusType,
} from "@data/issues";
import AttachmentList from "@pages/issues/components/AttachmentList";
import { StatusChip } from "@pages/issues/components/IssueStatusChip";
import { EditButton } from "./EditButton";
import { stripHtmlDescription, formatDate } from "@utils/formatters";

interface Props {
  issueId?: string;
  issueStats?: IssueStats;
  user: User;
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}

export default function IssueDetailsSidebar({
  issueId,
  issueStats = { hasVoted: false, votes: 0, comments: 0 },
  user,
  onClose,
  onSaved,
  onError,
}: Props) {
  const TabIndex = {
    Details: 0,
    Comments: 1,
  } as const;
  type TabIndex = (typeof TabIndex)[keyof typeof TabIndex];

  const [selectedTab, setSelectedTab] = useState<TabIndex>(TabIndex.Details);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  type EditingField = "summary" | "description" | "office" | "status";
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [errors, setErrors] = useState<{
    summary?: string;
    description?: string;
  }>({});

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

  const { data: issue, isError: issueDetailsError } = useIssueDetails(
    issueId,
    issueStats
  );
  const { data: offices = [], isError: officesError } = useOffices();
  const queryClient = useQueryClient();

  const admin = user.role === "ADMIN";
  const issueOwner = issue?.reportedByEmail === user.email;
  const attachments: IssueAttachment[] = issue?.attachments ?? [];

  useEffect(() => {
    if (issueDetailsError) {
      onError("Failed to load issue details.");
    }
  }, [issueDetailsError, onError]);

  useEffect(() => {
    if (officesError) {
      onError("Failed to load offices.");
    }
  }, [officesError, onError]);

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

      const refs: Record<
        EditingField,
        React.RefObject<HTMLDivElement | null>
      > = {
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
    if (issue) {
      setEditingField(null);
      setForm({
        summary: issue.summary,
        description: stripHtmlDescription(issue.description),
        status: issue.status,
        officeId: issue.officeId,
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
    return isValid;
  }

  async function handleSave() {
    if (!issue) return;
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (issueOwner) {
        const payload = {
          summary: form.summary,
          description: `<p>${form.description.replace(/\n/g, "</p><p>")}</p>`,
          officeId: form.officeId || issue.officeId,
        };
        await updateIssue(issue.id, payload);
      }
      if (admin) {
        if (form.status !== issue.status) {
          await updateIssueStatus(issue.id, form.status);
        }
        if (!issueOwner && form.officeId !== issue.officeId) {
          await updateIssue(issue.id, { officeId: form.officeId });
        }
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.issues(),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.issueDetails(issue.id),
      });

      onSaved();
      onClose();
    } catch {
      onError("Failed to save the Issue.");
    } finally {
      setSaving(false);
    }
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
      onError("Failed to delete the issue.");
    } finally {
      setDeleting(false);
    }
  };
  const handleAttachmentDelete = async (attachmentId: string) => {
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this attachment? This action cannot be undone."
    );
    if (!deleteConfirmation) return;
    try {
      await deleteAttachment(attachmentId);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.attachments(),
      });

      onSaved();
    } catch {
      onError("Failed to delete the attachment.");
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
    <RightDrawer open={!!issueId} onClose={onClose}>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Box
          ref={summaryRef}
          display="flex"
          justifyContent="space-between"
          mt={1}
        >
          {editingField !== "summary" && (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "22px",
                  fontWeight: 400,
                  lineHeight: "1.3",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {form.summary}
              </Typography>

              {issueOwner && (
                <EditButton onClick={() => setEditingField("summary")} />
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

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "140px 1fr" }}
          gap={2}
          alignItems="center"
          mb={2}
        >
          <Typography variant="body2">Reported by</Typography>
          <Box>
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

          <Typography variant="body2">Reported</Typography>
          <Box>
            <Typography variant="body2" color="text.primary">
              {formatDate(issue.dateCreated)}
            </Typography>
          </Box>

          <Typography variant="body2">Status</Typography>
          <Box ref={statusRef}>
            {editingField !== "status" && (
              <Box display="flex" alignItems="center" gap={1}>
                <StatusChip status={form.status} />
                {admin && (
                  <EditButton onClick={() => setEditingField("status")} />
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
                    status: e.target.value as IssueStatusType,
                  }));
                }}
              >
                {(Object.values(IssueStatus) as IssueStatusType[]).map(
                  (status) => (
                    <MenuItem key={status} value={status}>
                      <StatusChip status={status} />
                    </MenuItem>
                  )
                )}
              </Select>
            )}
          </Box>

          <Typography variant="body2">Upvotes</Typography>
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

          <Typography variant="body2">Office</Typography>
          <Box ref={officeRef}>
            {editingField !== "office" && (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>
                  {(() => {
                    const selectedOffice = offices.find(
                      (o) => o.id === form.officeId
                    );
                    return selectedOffice
                      ? `${selectedOffice.title}, ${selectedOffice.country}`
                      : issue.office;
                  })()}
                </Typography>
                {(issueOwner || admin) && (
                  <EditButton onClick={() => setEditingField("office")} />
                )}
              </Box>
            )}

            {editingField === "office" && (issueOwner || admin) && (
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
            )}
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
            disabled
            label={`Comments (${issue.comments})`}
            sx={{ textTransform: "none" }}
          />
        </Tabs>

        {selectedTab === TabIndex.Details && (
          <Box ref={descriptionRef}>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            {editingField !== "description" && (
              <Box
                sx={{
                  padding: 1,
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
                  <EditButton onClick={() => setEditingField("description")} />
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

            {attachments.length > 0 && issueOwner && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Attachments
                </Typography>

                <AttachmentList
                  attachments={attachments.map((attachment) => ({
                    id: attachment.id,
                    name: attachment.originalFilename,
                    url: attachment.url,
                  }))}
                  showDelete={true}
                  onDelete={() => handleAttachmentDelete}
                />
              </Box>
            )}

            {attachments.length > 0 && !issueOwner && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Attachments
                </Typography>

                <AttachmentList
                  attachments={attachments.map((attachment) => ({
                    id: attachment.id,
                    name: attachment.originalFilename,
                    url: attachment.url,
                  }))}
                />
              </Box>
            )}
          </Box>
        )}

        {selectedTab === TabIndex.Comments && (
          <Typography variant="body1" color="text.primary">
            Comments section is under construction.
          </Typography>
        )}
      </Box>

      {(issueOwner || admin) && (
        <Box>
          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
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
            </Box>

            <Box ref={actionsRef} display="flex" gap={2}>
              <Button
                variant="outlined"
                size="medium"
                onClick={onClose}
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
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </RightDrawer>
  );
}
