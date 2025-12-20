import { useState, useEffect, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import EditorToolbar from "@components/EditorToolbar";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import AttachmentList from "./components/AttachmentList";
import { fetchOffices } from "@api/services/offices";
import { useCreateIssue } from "@api/queries/useCreateIssue";

interface IssueFormData {
  summary: string;
  description: string;
  office: string;
}

interface IssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IssueFormData) => void;
}

interface Office {
  id: string;
  title: string;
  country: string;
}

interface FileWithURL {
  file: File;
  url: string;
}

export default function IssueModal({
  open,
  onClose,
  onSubmit,
}: IssueModalProps) {
  const [summary, setSummary] = useState("");
  const [office, setOffice] = useState("");
  const [description, setDescription] = useState("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileWithURL[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const { mutateAsync: createIssue, isPending } = useCreateIssue();

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

  useEffect(() => {
    if (open && editor) {
      editor.commands.setContent("");
      setSummary("");
      setOffice("");
      setDescription("");
      setErrorMessage("");
      setAttachmentError("");
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.url));
      setSelectedFiles([]);
      setIsDragging(false);
    }
  }, [open, editor]);

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

  const isFormValid =
    summary.trim() !== "" && office !== "" && description !== "";

  const handleFilesAdd = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    const ALLOWED_TYPES = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    const MAX_FILES = 10;

    const newFiles: FileWithURL[] = [];
    let errorMessage = "";

    Array.from(files).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errorMessage = `Unsupported file type: ${file.name}`;
        return;
      }

      if (file.size > MAX_SIZE_BYTES) {
        errorMessage = `File too large (max 5MB): ${file.name}`;
        return;
      }

      const duplicate = selectedFiles.some(
        (f) => f.file.name === file.name && f.file.size === file.size
      );
      if (duplicate) {
        errorMessage = `File already added: ${file.name}`;
        return;
      }

      newFiles.push({ file, url: URL.createObjectURL(file) });
    });

    if (selectedFiles.length + newFiles.length > MAX_FILES) {
      errorMessage = `Cannot add more than ${MAX_FILES} files`;
      newFiles.splice(MAX_FILES - selectedFiles.length);
    }

    if (errorMessage) {
      setAttachmentError(errorMessage);
    } else {
      setAttachmentError("");
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFilesAdd(event.dataTransfer.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFilesAdd(event.target.files);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!isFormValid) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    const selectedOffice = offices.find((o) => o.title === office);
    if (!selectedOffice) {
      setErrorMessage("Please select a valid office");
      return;
    }

    const issuePayload = {
      summary,
      description: editor?.getHTML() ?? "",
      officeId: selectedOffice.id,
    };

    try {
      await createIssue({
        issue: issuePayload,
        files: selectedFiles.map((f) => f.file),
      });

      onSubmit({
        summary,
        description: editor?.getHTML() ?? "",
        office,
      });
      onClose();
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
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableRestoreFocus
    >
      <DialogTitle
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
        onClick={onClose}
        size="small"
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
              onChange={(e) => setSummary(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              autoFocus
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
                outline: editor?.isFocused ? "2px solid black" : "none",
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
                    className="custom-editor"
                    style={{ flex: 1, width: "100%" }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box>
            <Box mb={0.5} sx={{ color: "text.secondary", fontSize: "14px" }}>
              Office <span style={{ color: "red" }}>*</span>
            </Box>
            <TextField
              select
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ width: "45%" }}
            >
              {offices.map((o) => (
                <MenuItem key={o.id} value={o.title}>
                  {o.title}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <Box
              mb={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              <Box display="flex" alignItems="center" gap={0.8}>
                <Box sx={{ color: "text.secondary" }}>Attachments</Box>

                <Tooltip
                  arrow
                  placement="top"
                  title={
                    <Box sx={{ fontSize: "11px", lineHeight: 1.5 }}>
                      <div>Allowed formats: PNG, JPG, JPEG, WEBP</div>
                      <div>Max file size: 5 MB</div>
                      <div>Up to 10 files</div>
                    </Box>
                  }
                >
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: 16,
                      cursor: "pointer",
                      color: "text.disabled",
                    }}
                  />
                </Tooltip>

                {attachmentError && (
                  <Tooltip title={attachmentError}>
                    <Box
                      sx={{
                        maxWidth: "400px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "error.main",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      {attachmentError}
                    </Box>
                  </Tooltip>
                )}
              </Box>

              {selectedFiles.length > 0 && (
                <Box
                  sx={{
                    fontSize: "13px",
                    color: "primary.main",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                  onClick={triggerFileInput}
                >
                  Upload File
                </Box>
              )}
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />

            {selectedFiles.length === 0 && (
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  border: "2px dashed",
                  borderColor: isDragging ? "secondary.main" : "divider",
                  borderRadius: 1,
                  padding: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isDragging ? "action.hover" : "transparent",
                  transition: "all 0.2s",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 1.3,
                    gap: 0.7,
                    cursor: "pointer",
                  }}
                >
                  <CloudUploadIcon
                    sx={{ fontSize: 23, color: "text.secondary" }}
                  />

                  <Box sx={{ fontSize: "13px", color: "text.secondary" }}>
                    Drop files to attach or{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "primary.main",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileInput();
                      }}
                    >
                      browse
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            <Box>
              {selectedFiles.length > 0 && (
                <AttachmentList
                  attachments={selectedFiles.map((f) => ({
                    id: f.file.name + f.file.size,
                    name: f.file.name,
                    url: f.url,
                  }))}
                  showDelete={true}
                  onDelete={(id) => {
                    setSelectedFiles((prev) =>
                      prev.filter((f) => {
                        const fileId = f.file.name + f.file.size;
                        if (fileId === id) {
                          URL.revokeObjectURL(f.url);
                        }
                        return fileId !== id;
                      })
                    );
                  }}
                />
              )}
            </Box>
          </Box>
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
          onClick={onClose}
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
          disabled={!isFormValid}
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
