import { Card, CardContent, Box, Typography } from "@mui/material";
import type { Issue } from "@data/issues";
import { StatusChip } from "@pages/issues/components/IssueStatusChip";
import { VoteSection } from "@pages/issues/components/VoteSection";
import { stripHtml, formatDate } from "@utils/formatters";

interface IssueCardProps {
  issue: Issue;
  onClickCard: () => void;
  onClickVote: () => void;
}

export default function IssueCard({
  issue,
  onClickCard,
  onClickVote,
}: IssueCardProps) {
  console.log(issue);
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        borderRadius: 0.6,
        cursor: "pointer",
        transition:
          "background-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease",
        "&:hover": {
          "&:not(:has(button:hover))": {
            backgroundColor: "#d8d8d8ff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            transform: "translateY(-0.5px)",
          },
        },
      }}
      onClick={onClickCard}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          sx={{ minWidth: 0, pr: 2 }}
        >
          {/* Issue summary */}
          <Box flex="1 1 50%">
            <Typography variant="subtitle1" fontWeight={500}>
              {issue.summary}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: "95%",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {stripHtml(issue.description)}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              mt={0.5}
              display="block"
            >
              {formatDate(issue.date)}
            </Typography>
          </Box>

          {/* Status chip */}
          <Box flex="0 0 150px" display="flex" justifyContent="center">
            <StatusChip status={issue.status} />
          </Box>

          {/* Vote section */}
          <VoteSection
            hasVoted={issue.hasVoted}
            votes={issue.votes}
            comments={issue.comments}
            status={issue.status}
            onVote={onClickVote}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
