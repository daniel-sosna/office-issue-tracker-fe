import React from "react";
import { Box, Typography, Link, Avatar } from "@mui/material";

interface AttachmentItemProps {
  name: string;
  url: string;
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

const AttachmentItem: React.FC<AttachmentItemProps> = ({ name, url }) => {
  const thumbnailUrl = getThumbnailUrl(url);
  const downloadUrl = getDownloadUrl(url);

  return (
    <Box
      sx={{
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
      <Avatar
        src={thumbnailUrl}
        variant="rounded"
        sx={{ width: 48, height: 48, marginRight: "10px", borderRadius: 0.3 }}
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          color="text.primary"
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", letterSpacing: "0.2px" }}
        >
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            Media
          </Link>{" "}
          •{" "}
          <Link
            href={downloadUrl}
            underline="none"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            Download
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default AttachmentItem;
