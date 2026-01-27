import React, { useMemo } from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AttachmentItemProps {
  id: string;
  name: string;
  url: string;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
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
  id,
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
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(id);
          }}
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

      <Box
        component="button"
        onClick={handleClick}
        sx={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          width: 48,
          height: 48,
          marginRight: "10px",
          borderRadius: 0.3,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={thumbnailUrl}
          alt={name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Box
          component="button"
          onClick={handleClick}
          sx={{
            border: "none",
            background: "transparent",
            padding: 0,
            textAlign: "left",
            cursor: "pointer",
            maxWidth: "140px",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            color="text.primary"
          >
            {name}
          </Typography>
        </Box>
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
