import { IssueStatus, type IssueStatusType } from "@data/issues";
import { Chip } from "@mui/material";
import theme from "@styles/theme";
import { backendToFrontendStatus } from "@utils/issueStatusMapping";

interface StatusChipProps {
  status: IssueStatusType;
}

const palette = theme.palette.status;

const statusStyles: Record<
  IssueStatusType,
  { backgroundColor: string; color: string }
> = {
  [IssueStatus.Open]: {
    backgroundColor: palette.openBg,
    color: palette.mainText,
  },
  [IssueStatus.InProgress]: {
    backgroundColor: palette.inProgressBg,
    color: palette.mainText,
  },
  [IssueStatus.Resolved]: {
    backgroundColor: palette.resolvedBg,
    color: palette.mainText,
  },
  [IssueStatus.Closed]: {
    backgroundColor: palette.closedBg,
    color: palette.mutedText,
  },
  [IssueStatus.Blocked]: {
    backgroundColor: palette.blockedBg,
    color: palette.mainText,
  },
};

export function StatusChip({ status }: StatusChipProps) {
  const displayStatus = backendToFrontendStatus[status] ?? "Unknown";
  const { backgroundColor, color } = statusStyles[status] ?? {
    backgroundColor: palette.openBg,
    color: palette.mainText,
  };

  return (
    <Chip
      label={displayStatus}
      size="small"
      sx={{
        minWidth: 90,
        backgroundColor,
        color,
        fontWeight: 500,
      }}
    />
  );
}
