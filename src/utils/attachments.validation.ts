export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_FILES = 10;
export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(
  file: File,
  existingFiles: File[]
): FileValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.name}` };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File too large (max 5MB): ${file.name}` };
  }

  const duplicate = existingFiles.some(
    (f) => f.name === file.name && f.size === file.size
  );
  if (duplicate) {
    return { valid: false, error: `File already added: ${file.name}` };
  }

  return { valid: true };
}

export function validateFiles(files: FileList, existingFiles: File[]) {
  const validFiles: File[] = [];
  let errorMessage = "";

  Array.from(files).forEach((file) => {
    const result = validateFile(file, existingFiles);
    if (!result.valid) {
      errorMessage = result.error!;
      return;
    }
    validFiles.push(file);
  });

  if (existingFiles.length + validFiles.length > MAX_FILES) {
    errorMessage = `Cannot add more than ${MAX_FILES} files`;
    validFiles.splice(MAX_FILES - existingFiles.length);
  }

  return { validFiles, errorMessage };
}
