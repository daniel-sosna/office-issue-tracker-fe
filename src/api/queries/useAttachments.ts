import { useState } from "react";
import { validateFiles } from "@utils/attachments.validation";

export function useAttachments() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState("");

  const handleAddFiles = (files: FileList) => {
    const { validFiles, errorMessage } = validateFiles(files, selectedFiles);

    if (errorMessage) {
      setAttachmentError(errorMessage);
    } else {
      setAttachmentError("");
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDeleteFile = (id: string) => {
    setSelectedFiles((prev) =>
      prev.filter((f) => {
        if (f.name + f.size === id) {
          URL.revokeObjectURL(f.name);
        }
        return f.name + f.size !== id;
      })
    );
  };
  const resetAttachments = () => {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.name));
    setSelectedFiles([]);
    setAttachmentError("");
  };

  return {
    selectedFiles,
    attachmentError,
    handleAddFiles,
    handleDeleteFile,
    resetAttachments,
  };
}
