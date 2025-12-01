import { Chip } from "@mui/material";
import theme from "@styles/theme";
import { backendToFrontendStatus } from "@utils/issueStatusMapping";

interface StatusChipProps {
  status: string;
}

const palette = theme.palette.status;

const statusStyles: Record<string, { backgroundColor: string; color: string }> =
  {
    Open: { backgroundColor: palette.openBg, color: palette.mainText },
    "In progress": {
      backgroundColor: palette.inProgressBg,
      color: palette.mainText,
    },
    Resolved: { backgroundColor: palette.resolvedBg, color: palette.mutedText },
    Closed: { backgroundColor: palette.closedBg, color: palette.mutedText },
    Pending: { backgroundColor: palette.pendingBg, color: palette.mainText },
    Blocked: { backgroundColor: palette.blockedBg, color: palette.mainText },
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
