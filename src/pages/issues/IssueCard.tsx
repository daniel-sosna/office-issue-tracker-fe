import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CursorRing from "../../components/CursorRing";
import {
  type IssueStatusType,
  IssueStatus,
  type Issue,
} from "../../data/issues";

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const isClosedOrResolved =
    issue.status === IssueStatus.Closed ||
    issue.status === IssueStatus.Resolved;

  const statusStyles: Record<
    IssueStatusType,
    { backgroundColor: string; color: string }
  > = {
    [IssueStatus.Open]: { backgroundColor: "#C1E1C1", color: "#2E7D32" },
    [IssueStatus.InProgress]: { backgroundColor: "#B3E5FC", color: "#0277BD" },
    [IssueStatus.Resolved]: { backgroundColor: "#E0E0E0", color: "#9E9E9E" },
    [IssueStatus.Closed]: { backgroundColor: "#E0E0E0", color: "#9E9E9E" },
  };

  const { backgroundColor, color } = statusStyles[issue.status] || {
    backgroundColor: "#E0E0E0",
    color: "#000",
  };

  const flexCenter = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      <CursorRing target=".issue-card" />

      <Card
        className="issue-card"
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
      >
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            {/* Issue header */}
            <Box flex="1 1 50%">
              <Typography variant="subtitle1" fontWeight={500}>
                {issue.title}
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
                {issue.description}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                mt={0.5}
                display="block"
              >
                {issue.date}
              </Typography>
            </Box>

            {/* Status chip */}
            <Box
              flex="0 0 150px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Chip
                label={issue.status}
                size="small"
                sx={{
                  minWidth: 90,
                  textTransform: "capitalize",
                  backgroundColor,
                  color,
                  fontWeight: 500,
                }}
              />
            </Box>

            {/* Stats + vote */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={3.5}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={9}
                flex="0 0 260px"
              >
                <Box {...flexCenter} gap={0.7} sx={{ minWidth: 50 }}>
                  <ArrowUpwardIcon
                    fontSize="small"
                    sx={{ color: "primary.main" }}
                  />
                  <Typography variant="body2" sx={{ color: "primary.main" }}>
                    {issue.votes}
                  </Typography>
                </Box>

                <Box {...flexCenter} gap={0.7} sx={{ minWidth: 50 }}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <Typography variant="body2">{issue.comments}</Typography>
                </Box>
              </Box>

              {/* Vote button */}
              <Box sx={{ minWidth: 80, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  startIcon={
                    <ArrowUpwardIcon
                      fontSize="medium"
                      sx={{ color: "primary.main" }}
                    />
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
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
