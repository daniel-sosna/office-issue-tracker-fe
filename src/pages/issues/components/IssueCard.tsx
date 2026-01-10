import {
  Card,
  CardContent,
  Box,
  Typography,
  CardActionArea,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import type { Issue } from "@data/issues";
import { StatusChip } from "@pages/issues/components/IssueStatusChip";
import { IssueActionButton } from "@pages/issues/components/IssueActionButton";
import { formatDate, stripHtml, stripHtmlDescription } from "@utils/formatters";
import { truncate } from "@utils/truncation";

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
  const summary = truncate(stripHtml(issue.summary), 75);
  const description = truncate(stripHtmlDescription(issue.description), 100);
  const dateCreated = formatDate(issue.dateCreated);

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        borderRadius: 0.6,
      }}
    >
      <CardActionArea onClick={onClickCard}>
        <CardContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-around",
            minWidth: 0,
            gap: 2,
            py: 1.5,
          }}
        >
          <Box flex="1 1 50%" minWidth="400px">
            <Typography variant="subtitle1" fontWeight={500} noWrap>
              {summary}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {description}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              mt={0.5}
              display="block"
            >
              {dateCreated}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={6.5}>
            <Box textAlign="center">
              <StatusChip status={issue.status} />
            </Box>

            <Box
              display="flex"
              alignItems="stretch"
              gap={0.7}
              sx={{ minWidth: 50 }}
            >
              <ArrowUpwardIcon fontSize="small" />
              <Typography variant="body1">{issue.votes}</Typography>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              gap={0.7}
              sx={{ minWidth: 50 }}
            >
              <ChatBubbleOutlineIcon fontSize="small" />
              <Typography variant="body1">{issue.comments}</Typography>
            </Box>
          </Box>

          <Box flex="0 0 auto" sx={{ px: 4 }}>
            <IssueActionButton {...issue} onVote={onClickVote} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
