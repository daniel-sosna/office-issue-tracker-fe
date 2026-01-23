import React, { useMemo } from "react";
import { Box, Typography, Link, Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AttachmentItemProps {
  name: string;
  url: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

const getThumbnailUrl = (url: string): string => {
  if (url.includes("cloudinary.com")) {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/c_thumb,w_48,h_48,g_auto,q_auto/${parts[1]}`;
    }
  }

  return url;
};

const getDownloadUrl = (url: string): string => {
  if (url.includes("cloudinary.com")) {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
  }
  return url;
};

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  name,
  url,
  showDelete,
  onDelete,
}) => {
  const thumbnailUrl = useMemo(() => getThumbnailUrl(url), [url]);
  const downloadUrl = useMemo(() => getDownloadUrl(url), [url]);

  const isLocal = url.startsWith("blob:");

  function handleClick() {
    window.open(url);
  }

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        border: "2px solid #e9e8e8ff",
        boxShadow: "0 1px 7px #0000001f",
        borderRadius: "6px",
        padding: "6px",
        marginBottom: "8px",
        width: "230px",
        height: "64px",
      }}
    >
      {showDelete && (
        <IconButton
          size="small"
          onClick={onDelete}
          color="primary"
          disableRipple
          sx={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

      <Avatar
        component="button"
        variant="rounded"
        onClick={handleClick}
        sx={{
          all: "unset",
          cursor: "pointer",
          width: 48,
          height: 48,
          marginRight: "10px",
          borderRadius: 0.3,
        }}
        src={thumbnailUrl}
      />
      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Typography
          variant="body1"
          component="button"
          onClick={handleClick}
          sx={{
            all: "unset",
            fontWeight: "bold",
            maxWidth: "140px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          color="text.primary"
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", letterSpacing: "0.2px" }}
        >
          {!isLocal && (
            <>
              {" "}
              •{" "}
              <Link
                href={downloadUrl}
                underline="none"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                  "&:hover": { color: "text.primary" },
                }}
              >
                Download
              </Link>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default AttachmentItem;
