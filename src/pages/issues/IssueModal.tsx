import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { fetchOffices, type Office } from "@api/services/offices";
import { useCreateIssue } from "@api/queries/useCreateIssue";
import AttachmentSection from "./components/AttachmentSection";
import EditorToolbar from "@components/EditorToolbar";
import { useAttachments } from "@api/queries/useAttachments.ts";
import { formatOffice } from "@utils/formatters";
import { Select } from "@mui/material";

interface IssueFormData {
  summary: string;
  description: string;
  office: string;
}

interface IssueFormErrors {
  summary?: string;
  description?: string;
}

interface IssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IssueFormData) => void;
}

export default function IssueModal({ open, onClose }: IssueModalProps) {
  const [summary, setSummary] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [description, setDescription] = useState("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { mutateAsync: createIssueMutation, isPending } = useCreateIssue();
  const {
    selectedFiles,
    attachmentError,
    handleAddFiles,
    handleDeleteFile,
    resetAttachments,
  } = useAttachments();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const errors = {
    summary: validateSummary(summary),
    description: validateDescription(description),
  } as IssueFormErrors;

  useEffect(() => {
    if (!open) return;

    const loadOffices = async () => {
      try {
        const data = await fetchOffices();
        setOffices(data);
      } catch (err) {
        setErrorMessage("Failed to fetch offices: " + String(err));
      }
    };

    void loadOffices();
  }, [open]);

  const handleClose = () => {
    editor.commands.setContent("");
    setSummary("");
    setOfficeId("");
    setDescription("");
    setErrorMessage("");
    setHasSubmitted(false);
    resetAttachments();
    onClose();
  };

  const isFormComplete =
    summary.trim() !== "" && description.trim() !== "" && officeId !== "";

  useEffect(() => {
    if (!editor) return;

    const updateListener = () => {
      const text = editor.getText().trim();
      setDescription(text);
    };
    editor.on("update", updateListener);

    return () => {
      editor.off("update", updateListener);
    };
  }, [editor]);

  function validateSummary(value: string): string | undefined {
    if (!value.trim()) return "Summary is required";
    if (value.trim().length < 3) return "Summary must be at least 3 characters";
    if (value.length > 200) return "Summary must be less than 200 characters";
    return undefined;
  }

  function validateDescription(value: string): string | undefined {
    if (!value.trim()) return "Description is required";
    if (value.length > 2000)
      return "Description must be less than 2000 characters";
    return undefined;
  }

  const handleSubmit = async (): Promise<void> => {
    setHasSubmitted(true);

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    const selectedOffice = offices.find((o) => o.id === officeId);
    if (!selectedOffice) {
      setErrorMessage("Please select a valid office");
      return;
    }

    try {
      const issuePayload = {
        summary,
        description: editor?.getHTML() ?? "",
        officeId: selectedOffice.id,
      };

      await createIssueMutation({
        issue: issuePayload,
        files: selectedFiles,
      });

      handleClose();
    } catch (error: unknown) {
      let backendMessage = "An error occurred while submitting the issue";

      if (error instanceof Error) {
        backendMessage = error.message ?? backendMessage;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const errObj = error as { response?: { data?: { message?: string } } };
        backendMessage = errObj.response?.data?.message ?? backendMessage;
      }

      setErrorMessage(backendMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableRestoreFocus
      aria-labelledby="report-issue-title"
    >
      <DialogTitle
        id="report-issue-title"
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: 400,
          position: "relative",
          marginTop: "16px",
        }}
      >
        Report Issue
      </DialogTitle>
      <IconButton
        onClick={handleClose}
        size="small"
        aria-label="Close issue modal"
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          color: "secondary.main",
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          {errorMessage && (
            <Box color="red" fontWeight={500}>
              {errorMessage}
            </Box>
          )}

          <Box>
            <Box mb={0.5} sx={{ color: "text.secondary", fontSize: "14px" }}>
              Short summary <span style={{ color: "red" }}>*</span>
            </Box>
            <TextField
              value={summary}
              onChange={(e) => {
                const value = e.target.value;
                setSummary(value);
              }}
              variant="outlined"
              fullWidth
              size="small"
              autoFocus
              error={hasSubmitted && !!errors.summary}
              helperText={hasSubmitted && errors.summary ? errors.summary : " "}
            />
          </Box>

          <Box>
            <Box mb={1} sx={{ color: "text.secondary", fontSize: "14px" }}>
              Description <span style={{ color: "red" }}>*</span>
            </Box>
            <Box
              sx={{
                height: 250,
                display: "flex",
                flexDirection: "column",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                transition: "border 0.2s",
                outline:
                  hasSubmitted && errors.description
                    ? "1px solid red"
                    : editor?.isFocused
                      ? "2px solid black"
                      : "none",
                outlineOffset: -1,
              }}
              onClick={() => editor?.chain().focus().run()}
            >
              <EditorToolbar editor={editor} />
              <Box
                sx={{
                  flex: 1,
                  padding: 1,
                  overflowY: "auto",
                  cursor: "text",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {editor && (
                  <EditorContent
                    editor={editor}
                    aria-label="Description"
                    className="custom-editor"
                    style={{ flex: 1, width: "100%" }}
                  />
                )}
              </Box>
            </Box>
            <Box
              mt={0.5}
              ml={1.5}
              minHeight="18px"
              fontSize={12}
              color="error.main"
            >
              {hasSubmitted && errors.description ? errors.description : " "}
            </Box>
          </Box>

          <Box>
            <Box mb={0.5} sx={{ color: "text.secondary", fontSize: "14px" }}>
              Office <span style={{ color: "red" }}>*</span>
            </Box>
            <Select
              value={officeId}
              onChange={(e) => setOfficeId(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ width: "45%" }}
            >
              {offices.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {formatOffice(o)}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <AttachmentSection
            attachments={selectedFiles.map((f) => ({
              id: f.name + f.size,
              name: f.name,
              url: URL.createObjectURL(f),
            }))}
            onAddFiles={handleAddFiles}
            onDelete={handleDeleteFile}
            error={attachmentError}
            drawerEditor={false}
          />
        </Box>
      </DialogContent>

      <Box
        sx={{
          borderTop: "1px solid divider",
          marginTop: "24px",
          paddingTop: "16px",
          display: "flex",
          justifyContent: "flex-end",
          columnGap: "16px",
          padding: "16px",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          aria-label="Cancel reporting issue"
          sx={{
            borderRadius: "999px",
            paddingX: 3,
            color: "secondary.main",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={!isFormComplete || isPending}
          sx={{
            borderRadius: "999px",
            paddingX: 3,
            backgroundColor: "secondary.main",
          }}
        >
          {isPending ? "Reporting..." : "Report Issue"}
        </Button>
      </Box>

      <style>
        {`
          .custom-editor [contenteditable="true"]:focus {
            outline: none !important;
          }
          .custom-editor [contenteditable="true"] p,
          .custom-editor [contenteditable="true"] li {
            margin: 0;
            line-height: 1.5;
          }
        `}
      </style>
    </Dialog>
  );
}
