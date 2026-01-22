import { useState } from "react";
import { Typography, Button } from "@mui/material";
import { useNotificationsByIssue } from "@api/queries/useNotifications";

interface IssueActivityLogTabProps {
  issueId: string;
}

export default function IssueActivityLogTab({
  issueId,
}: IssueActivityLogTabProps) {
  const [visibleCount, setVisibleCount] = useState(5);

  const { data: notifications = [], isLoading } = useNotificationsByIssue(
    issueId ?? ""
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, notifications.length));
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <div style={{ maxHeight: 300, overflowY: "auto", padding: "4px 0" }}>
      {notifications.slice(0, visibleCount).map((note) => (
        <div
          key={note.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body2">{note.message}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(note.createdAt).toLocaleString()}
          </Typography>
        </div>
      ))}

      {visibleCount < notifications.length && (
        <Button
          variant="text"
          fullWidth
          onClick={handleLoadMore}
          sx={{ mt: 1 }}
        >
          Load More
        </Button>
      )}
    </div>
  );
}
