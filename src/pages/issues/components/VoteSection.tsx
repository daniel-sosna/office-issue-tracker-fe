import { Box, Typography, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { IssueStatus, type IssueStatusType } from "@data/issues";

export interface VoteSectionProps {
  status: IssueStatusType;
  isOwner: boolean;
  hasVoted: boolean;
  votes: number;
  comments: number;
  onVote: () => void;
}

export function VoteSection({
  isOwner,
  hasVoted,
  votes,
  comments,
  status,
  onVote,
}: VoteSectionProps) {
  const isClosedOrResolved =
    status === IssueStatus.Closed || status === IssueStatus.Resolved;

  return (
    <Box display="flex" alignItems="center" gap={6.5} sx={{ minWidth: 0 }}>
      {/* vote + comment counts */}
      <Box
        display="flex"
        alignItems="center"
        gap={8}
        flex="0 0 auto"
        sx={{ minWidth: 160 }}
      >
        <Box display="flex" alignItems="center" gap={0.7} sx={{ minWidth: 50 }}>
          <ArrowUpwardIcon fontSize="small" sx={{ color: "primary.main" }} />
          <Typography variant="body2" sx={{ color: "primary.main" }}>
            {votes}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.7} sx={{ minWidth: 50 }}>
          <ChatBubbleOutlineIcon fontSize="small" />
          <Typography variant="body2">{comments}</Typography>
        </Box>
      </Box>

      {/* Edit/Vote button */}
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
    </Box>
  );
}
