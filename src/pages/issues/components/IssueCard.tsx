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
            justifyContent: "space-between",
            gap: { xs: 1.5, md: 2 },
            minWidth: 0,
            py: 1.5,
          }}
        >
          <Box flex={{ xs: "1 0 100%", md: "auto" }} minWidth={0}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: { xs: 2, sm: 1 },
              }}
            >
              {summary}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: { xs: 3, sm: 1 },
              }}
            >
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

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            gap={{ xs: 2, md: 6 }}
            maxWidth={{ xs: "400px", md: "auto" }}
            flex={{ xs: "1", md: "0" }}
          >
            <Box textAlign="center">
              <StatusChip status={issue.status} />
            </Box>

            <Box
              display="flex"
              alignItems="stretch"
              gap={{ xs: 0.5, md: 0.7 }}
              minWidth={{ xs: 40, md: 50 }}
            >
              <ArrowUpwardIcon fontSize="small" />
              <Typography variant="body1">{issue.votes}</Typography>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              gap={{ xs: 0.5, md: 0.7 }}
              minWidth={{ xs: 40, md: 50 }}
            >
              <ChatBubbleOutlineIcon fontSize="small" />
              <Typography variant="body1">{issue.comments}</Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="end" flex={{ xs: "1", md: "0" }}>
            <IssueActionButton {...issue} onVote={onClickVote} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
