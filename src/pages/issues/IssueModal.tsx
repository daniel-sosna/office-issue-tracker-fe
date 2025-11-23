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

import EditorToolbar from "@components/EditorToolBar";

import { useEditor, EditorContent } from "@tiptap/react";
import { csrfFetch } from "@utils/csrfFetch";
import StarterKit from "@tiptap/starter-kit";

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

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    if (!open) return;

    const fetchOffices = async () => {
      try {
        const res = await csrfFetch("http://localhost:8080/offices");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Office[];
        setOffices(data);
      } catch (err) {
        setErrorMessage("Failed to fetch offices: " + String(err));
      }
    };
    void fetchOffices();
  }, [open]);

  useEffect(() => {
    if (open && editor) {
      editor.commands.setContent("");
      setSummary("");
      setOffice("");
      setDescription("");
      setErrorMessage("");
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

    const issueData = {
      summary,
      description: editor?.getHTML() ?? "",
      officeId: selectedOffice.id,
    };

    try {
      const res = await csrfFetch("http://localhost:8080/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issueData),
      });

      if (!res.ok) {
        setErrorMessage("Failed to submit the issue");
        return;
      }

      await res.json();

      onSubmit({
        summary,
        description: editor?.getHTML() ?? "",
        office,
      });
      onClose();
    } catch {
      setErrorMessage("An error occurred while submitting the issue");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Report Issue
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          {errorMessage && (
            <Box color="red" fontWeight={500}>
              {errorMessage}
            </Box>
          )}

          <Box>
            <Box mb={0.5} fontWeight={500}>
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
            <Box mb={1} fontWeight={500}>
              Description <span style={{ color: "red" }}>*</span>
            </Box>
            <Box
              sx={{
                height: 250,
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ccc",
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
            <Box mb={0.5} fontWeight={500}>
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
        </Box>
      </DialogContent>

      <Box
        sx={{
          borderTop: "1px solid #ddd",
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
          sx={{ borderRadius: "999px", paddingX: 3 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={!isFormValid}
          sx={{ borderRadius: "999px", paddingX: 3 }}
        >
          Report Issue
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
