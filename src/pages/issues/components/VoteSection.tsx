import { Box, Typography, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { IssueStatus, type IssueStatusType } from "@data/issues";

export interface VoteSectionProps {
  votes: number;
  comments: number;
  status: IssueStatusType;
  onVote?: () => void;
}

export function VoteSection({
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

      {/* Vote button */}
      <Box sx={{ minWidth: 80, textAlign: "center" }}>
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          onClick={onVote}
          disabled={isClosedOrResolved}
          startIcon={
            <ArrowUpwardIcon fontSize="medium" sx={{ color: "primary.main" }} />
          }
          sx={{
            borderRadius: "9999px",
            textTransform: "none",
            visibility: isClosedOrResolved ? "hidden" : "visible",
            borderColor: "primary.main",
            "&:hover": {
              borderColor: "primary.dark",
              backgroundColor: "#d8d8d8ff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              transform: "translateY(-0.5px)",
            },
          }}
        >
          Vote
        </Button>
      </Box>
    </Box>
  );
}
