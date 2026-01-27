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
  TextField,
  Button,
} from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "@components/EditorToolbar";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
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
import CommentsSection from "@pages/comments/components/CommentsSection";
import { useAuth } from "@context/UseAuth";
import {
  IssueStatus,
  type IssueAttachment,
  type IssueStats,
  type IssueStatusType,
} from "@data/issues";
import AttachmentList from "@pages/issues/components/AttachmentList";
import { StatusChip } from "@pages/issues/components/IssueStatusChip";
import { EditButton } from "./EditButton";
import {
  stripHtmlDescription,
  formatDate,
  formatOffice,
} from "@utils/formatters";
import { sanitizeHtml } from "@utils/sanitizeHtml";
import AttachmentSection from "@pages/issues/components/AttachmentSection.tsx";
import { useAttachments } from "@api/queries/useAttachments.ts";
import ConfirmDialog from "@pages/issues/components/ConfirmDialog.tsx";

interface Props {
  issueId?: string;
  issueStats?: IssueStats;
  onClose: () => void;
  onCommentCreated: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}

export default function IssueDrawer({
  issueId,
  issueStats = { isOwner: false, hasVoted: false, votes: 0, comments: 0 },
  onClose,
  onCommentCreated,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAttachmentDialogOpen, setDeleteAttachmentDialogOpen] =
    useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState<string | null>(
    null
  );
  const {
    selectedFiles,
    attachmentError,
    handleAddFiles,
    handleDeleteFile,
    resetAttachments,
  } = useAttachments();

  type EditingField = "summary" | "description" | "office" | "status";
  const [editingField, setEditingField] = useState<EditingField | null>(null);

  const descriptionEditor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const [errors, setErrors] = useState<{
    summary?: string;
    description?: string;
  }>({});

  const { data: issue, isError: issueDetailsError } = useIssueDetails(
    issueId ?? "",
    issueStats
  );

  const [form, setForm] = useState<{
    summary: string;
    description: string;
    status: IssueStatusType;
    officeId: string;
  }>({
    summary: "",
    description: "",
    status: issue?.status ?? "Open",
    officeId: "",
  });

  const { data: offices = [], isError: officesError } = useOffices();
  const queryClient = useQueryClient();

  const selectedOffice = offices.find((o) => o.id === form.officeId);

  const { user } = useAuth();
  const admin = user?.role === "ADMIN";
  const issueOwner = issueStats?.isOwner ?? false;
  const attachments: IssueAttachment[] = issue?.attachments ?? [];
  const allowedToEdit =
    (issueOwner || admin) && selectedTab === TabIndex.Details;

  useEffect(() => {
    setSelectedTab(TabIndex.Details);
  }, [TabIndex.Details, issueId]);

  const summaryRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const officeRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!editingField) return;
      const target = event.target as HTMLElement;
      if (actionsRef.current?.contains(target)) return;
      if (target.closest(".MuiMenu-paper")) return;

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
    if (issueDetailsError) {
      onError("Failed to load issue details.");
    }
  }, [issueDetailsError, onError]);

  useEffect(() => {
    if (officesError) {
      onError("Failed to load offices.");
    }
  }, [officesError, onError]);

  useEffect(() => {
    if (issue) {
      setEditingField(null);
      setForm({
        summary: issue.summary,
        description: issue.description,
        status: issue.status || "Open",
        officeId: issue.officeId,
      });
    }
  }, [issue, issueStats]);

  useEffect(() => {
    if (editingField === "description" && descriptionEditor) {
      descriptionEditor.commands.setContent(form.description || "");
    }
  }, [editingField, descriptionEditor]);

  useEffect(() => {
    if (!descriptionEditor) return;

    const updateHandler = () => {
      setForm((prev) => ({
        ...prev,
        description: descriptionEditor.getHTML(),
      }));
    };

    descriptionEditor.on("update", updateHandler);

    return () => {
      descriptionEditor.off("update", updateHandler);
    };
  }, [descriptionEditor]);

  function validateForm() {
    const newErrors: typeof errors = {};
    if (!form.summary?.trim()) newErrors.summary = "Summary is required";
    else if (form.summary.trim().length < 3)
      newErrors.summary = "Summary must be at least 3 characters";
    else if (form.summary.length > 200)
      newErrors.summary = "Summary must be less than 200 characters";

    const plainText = stripHtmlDescription(descriptionEditor?.getText() ?? "");

    if (!plainText.trim()) newErrors.description = "Description is required";
    else if (plainText.length > 2000)
      newErrors.description = "Description must be less than 2000 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleClose = () => {
    resetAttachments();
    setEditingField(null);
    setErrors({});
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.name));
    onClose();
  };

  async function handleSave() {
    if (!issue || !validateForm()) return;

    try {
      setSaving(true);

      if (issueOwner) {
        await updateIssue(
          issue.id,
          {
            summary: form.summary,
            description: descriptionEditor?.getHTML() ?? "",
            officeId: form.officeId || issue.officeId,
          },
          selectedFiles
        );
      }

      if (admin) {
        if (form.status !== issue.status) {
          await updateIssueStatus(issue.id, form.status);
        }
        if (!issueOwner && form.officeId !== issue.officeId)
          await updateIssue(issue.id, { officeId: form.officeId });
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.issues() });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.issueDetails(issue.id),
      });

      onSaved();
      handleClose();
    } catch {
      onError("Failed to save the Issue.");
    } finally {
      setSaving(false);
    }
  }

  const handleDelete = async () => {
    if (!issue) return;

    try {
      setDeleting(true);

      await softDeleteIssue(issue.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.issues() });

      setDeleteDialogOpen(false);
      onClose();
    } catch {
      onError("Failed to delete the issue.");
    } finally {
      setDeleteDialogOpen(false);
      setDeleting(false);
    }
  };
  const handleAttachmentDelete = async () => {
    if (!attachmentToDelete || !issue) return;
    try {
      setDeleting(true);

      await deleteAttachment(attachmentToDelete);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.issueDetails(issue.id),
      });

      setDeleteAttachmentDialogOpen(false);
      setAttachmentToDelete(null);
      onSaved();
    } catch {
      onError("Failed to delete the attachment.");
    } finally {
      setDeleting(false);
    }
  };

  if (!issue) {
    return (
      <RightDrawer open={false} onClose={handleClose}>
        <Typography variant="h4" sx={{ fontWeight: 400 }}>
          Select an issue to see details.
        </Typography>
      </RightDrawer>
    );
  }

  return (
    <RightDrawer open={!!issueId} onClose={handleClose}>
      <Box flex={1}>
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
              onChange={(e) => {
                setForm((prev) => ({ ...prev, summary: e.target.value }));
              }}
              error={!!errors.summary}
              helperText={errors.summary}
              slotProps={{
                input: { sx: { fontSize: "22px", fontWeight: 400 } },
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

          <Typography variant="body2">Reported at</Typography>
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
                backgroundColor: issue.hasVoted ? "vote.activeBg" : "#f4f4f4",
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
                  {selectedOffice ? formatOffice(selectedOffice) : issue.office}
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
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, officeId: e.target.value }));
                }}
                sx={{ minWidth: 160 }}
              >
                {offices.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {formatOffice(o)}
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
            label={`Comments (${issueStats.comments})`}
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
                  component="div"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(form.description),
                  }}
                  sx={{
                    "& p:empty": {
                      minHeight: "1em",
                    },
                    "& p, & div, & ul, & ol": { margin: 0 },
                    "& ul, & ol": { paddingLeft: "1.25rem" },
                    "& li": { margin: 0 },
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: "text.primary",
                  }}
                />
                {issueOwner && (
                  <EditButton onClick={() => setEditingField("description")} />
                )}
              </Box>
            )}
            {editingField === "description" && issueOwner && (
              <Box>
                <Box
                  sx={{
                    height: 250,
                    display: "flex",
                    flexDirection: "column",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                  onClick={() => descriptionEditor?.chain().focus().run()}
                >
                  <EditorToolbar editor={descriptionEditor} />

                  <Box
                    sx={{
                      flex: 1,
                      p: 1,
                      overflowY: "auto",
                      cursor: "text",
                      display: "flex",
                      flexDirection: "column",
                      "& .ProseMirror p": { margin: 0 },
                      "& .ProseMirror ul, & .ProseMirror ol": {
                        margin: 0,
                        paddingLeft: "1.25rem",
                      },
                      "& .ProseMirror li": { margin: 0 },
                      "& .ProseMirror": { lineHeight: 1.5 },
                      "& .ProseMirror:focus": { outline: "none" },
                    }}
                  >
                    {descriptionEditor && (
                      <EditorContent
                        editor={descriptionEditor}
                        style={{ flex: 1, width: "100%" }}
                      />
                    )}
                  </Box>
                </Box>

                {errors.description && (
                  <Typography color="error" fontSize={12} mt={0.5}>
                    {errors.description}
                  </Typography>
                )}
              </Box>
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
                  onDelete={(id) => {
                    setAttachmentToDelete(id);
                    setDeleteAttachmentDialogOpen(true);
                  }}
                />
              </Box>
            )}

            {attachments.length > 0 && !issueOwner && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Attachments
                </Typography>
                <AttachmentList
                  attachments={attachments.map((a) => ({
                    id: a.id,
                    name: a.originalFilename,
                    url: a.url,
                  }))}
                />
              </Box>
            )}
            {issueOwner && (
              <AttachmentSection
                attachments={selectedFiles.map((f) => ({
                  id: f.name + f.size,
                  name: f.name,
                  url: URL.createObjectURL(f),
                }))}
                onAddFiles={handleAddFiles}
                onDelete={handleDeleteFile}
                error={attachmentError}
                drawerEditor={true}
              />
            )}
          </Box>
        )}
        {selectedTab === TabIndex.Comments && (
          <CommentsSection
            issueId={issue.id}
            onCommentCreated={onCommentCreated}
          />
        )}
      </Box>

      {/* Actions */}
      {allowedToEdit && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="outlined"
              size="medium"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ borderRadius: "999px", paddingX: 3 }}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>

            <Box ref={actionsRef} display="flex" gap={2}>
              <Button
                variant="outlined"
                size="medium"
                onClick={handleClose}
                sx={{ borderRadius: "999px", paddingX: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="medium"
                color="secondary"
                onClick={() => void handleSave()}
                sx={{ borderRadius: "999px", paddingX: 3 }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={"Delete Issue"}
        description={
          "Are you sure you want to delete this issue? This action cannot be\n" +
          "            undone."
        }
        loading={deleting}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => void handleDelete()}
      ></ConfirmDialog>

      <ConfirmDialog
        open={deleteAttachmentDialogOpen}
        title={"Delete Attachment"}
        description={
          "Are you sure you want to delete this attachment? This action cannot be\n" +
          "                 undone."
        }
        loading={deleting}
        onClose={() => setDeleteAttachmentDialogOpen(false)}
        onConfirm={() => void handleAttachmentDelete()}
      ></ConfirmDialog>
    </RightDrawer>
  );
}
