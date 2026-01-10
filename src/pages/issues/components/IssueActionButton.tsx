import { Box, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { IssueStatus, type IssueStatusType } from "@data/issues";

export interface IssueActionButtonProps {
  status: IssueStatusType;
  isOwner: boolean;
  hasVoted: boolean;
  onVote: () => void;
}

export function IssueActionButton({
  isOwner,
  hasVoted,
  status,
  onVote,
}: IssueActionButtonProps) {
  const isClosedOrResolved =
    status === IssueStatus.Closed || status === IssueStatus.Resolved;

  return (
    <Box sx={{ minWidth: 100, textAlign: "center" }}>
      {!isClosedOrResolved &&
        (isOwner ? (
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            sx={{
              borderRadius: "9999px",
              borderColor: "vote.inactive",
              backgroundColor: "vote.inactiveBg",
              "&:hover": {
                borderColor: "vote.hover.inactive",
                backgroundColor: "vote.hover.inactiveBg",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                transform: "translateY(-0.5px)",
              },
            }}
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onVote();
            }}
            startIcon={<ArrowUpwardIcon sx={{ color: "secondary.main" }} />}
            sx={{
              borderRadius: "9999px",
              borderColor: hasVoted ? "vote.active" : "vote.inactive",
              backgroundColor: hasVoted ? "vote.activeBg" : "vote.inactiveBg",
              "&:hover": {
                borderColor: hasVoted
                  ? "vote.hover.active"
                  : "vote.hover.inactive",
                backgroundColor: hasVoted
                  ? "vote.hover.activeBg"
                  : "vote.hover.inactiveBg",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                transform: "translateY(-0.5px)",
              },
            }}
          >
            {hasVoted ? "Voted" : "Vote"}
          </Button>
        ))}
    </Box>
  );
}
