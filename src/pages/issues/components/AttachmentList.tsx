import React from "react";
import { Box } from "@mui/material";
import AttachmentItem from "./AttachmentItem";

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface AttachmentListProps {
  attachments: Attachment[];
  showDelete?: boolean;
  onDelete?: (id: string) => void;
}

const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  showDelete,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: 2,
        rowGap: 1,
        width: "fit-content",
      }}
    >
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          name={attachment.name}
          url={attachment.url}
          showDelete={showDelete}
          onDelete={() => onDelete?.(attachment.id)}
        />
      ))}
    </Box>
  );
};

export default AttachmentList;
