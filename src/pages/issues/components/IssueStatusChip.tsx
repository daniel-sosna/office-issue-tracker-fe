import { type IssueStatusType, backendToFrontendStatusMap } from "@data/issues";
import { Chip } from "@mui/material";
import theme from "@styles/theme";

interface StatusChipProps {
  status: IssueStatusType | keyof typeof backendToFrontendStatusMap;
}

const palette = theme.palette.status;

const statusStyles: Record<
  IssueStatusType,
  { backgroundColor: string; color: string }
> = {
  Open: {
    backgroundColor: palette.openBg,
    color: palette.mainText,
  },
  "In Progress": {
    backgroundColor: palette.inProgressBg,
    color: palette.mainText,
  },
  Resolved: {
    backgroundColor: palette.resolvedBg,
    color: palette.mutedText,
  },
  Closed: {
    backgroundColor: palette.closedBg,
    color: palette.mutedText,
  },
  Blocked: {
    backgroundColor: palette.blockedBg,
    color: palette.mainText,
  },
};

export function StatusChip({ status }: StatusChipProps) {
  const displayStatus: IssueStatusType =
    backendToFrontendStatusMap[
      status as keyof typeof backendToFrontendStatusMap
    ] ?? (status as IssueStatusType);

  const { backgroundColor, color } = statusStyles[displayStatus] ?? {
    backgroundColor: palette.openBg,
    color: palette.mainText,
  };

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
