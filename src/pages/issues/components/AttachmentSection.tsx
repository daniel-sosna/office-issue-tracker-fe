import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AttachmentList, { type Attachment } from "./AttachmentList";

interface AttachmentSectionProps {
  attachments: Attachment[];
  onAddFiles: (files: FileList) => void;
  onDelete: (id: string) => void;
  error?: string;
}

export default function AttachmentSection({
  attachments,
  onAddFiles,
  onDelete,
  error,
}: AttachmentSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      onAddFiles(event.dataTransfer.files);
    }
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
    if (event.target.files) {
      onAddFiles(event.target.files);
    }
  };

  return (
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
              sx={{ fontSize: 16, cursor: "pointer", color: "text.disabled" }}
            />
          </Tooltip>

          {error && (
            <Tooltip title={error}>
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
                {error}
              </Box>
            </Tooltip>
          )}
        </Box>

        {attachments.length > 0 && (
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

      {attachments.length === 0 && (
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
            <CloudUploadIcon sx={{ fontSize: 23, color: "text.secondary" }} />
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

      {attachments.length > 0 && (
        <AttachmentList
          attachments={attachments}
          showDelete={true}
          onDelete={onDelete}
        />
      )}
    </Box>
  );
}
