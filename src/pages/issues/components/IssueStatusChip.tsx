import { Chip } from "@mui/material";
import { IssueStatus, type IssueStatusType } from "@data/issues";

interface StatusChipProps {
  status: IssueStatusType;
}

const statusStyles: Record<
  IssueStatusType,
  { backgroundColor: string; color: string }
> = {
  [IssueStatus.Open]: { backgroundColor: "#C1E1C1", color: "secondary" },
  [IssueStatus.InProgress]: { backgroundColor: "#B3E5FC", color: "secondary" },
  [IssueStatus.Resolved]: { backgroundColor: "#E0E0E0", color: "#9E9E9E" },
  [IssueStatus.Blocked]: { backgroundColor: "#E0E0E0", color: "#9E9E9E" },
  [IssueStatus.Closed]: { backgroundColor: "#E0E0E0", color: "#9E9E9E" },
};

export function StatusChip({ status }: StatusChipProps) {
  const { backgroundColor, color } = statusStyles[status];

  return (
    <Chip
      label={status}
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
