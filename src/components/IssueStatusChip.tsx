import { Chip } from "@mui/material";
import { backendToFrontendStatus } from "@utils/issueStatusMapping";

interface StatusChipProps {
  status: string;
}

const statusStyles: Record<string, { backgroundColor: string; color: string }> =
  {
    Open: { backgroundColor: "#CFE7D7", color: "secondary.main" },
    "In progress": { backgroundColor: "#DAE9FF", color: "secondary.main" },
    Resolved: { backgroundColor: "#EDEFF1", color: "#999999" },
    Closed: { backgroundColor: "#EDEFF1", color: "#999999" },
    Pending: { backgroundColor: "#FFF7DA", color: "secondary.main" },
    Blocked: { backgroundColor: "#FFDAE3", color: "secondary.main" },
  };

export function StatusChip({ status }: StatusChipProps) {
  const displayStatus = backendToFrontendStatus[status.toUpperCase()] ?? "Open";
  const { backgroundColor, color } = statusStyles[displayStatus];

  return (
    <Chip
      label={displayStatus}
      size="small"
      sx={{
        minWidth: 90,
        textTransform: "capitalize",
        backgroundColor,
        color,
        fontWeight: 500,
      }}
    />
  );
}
