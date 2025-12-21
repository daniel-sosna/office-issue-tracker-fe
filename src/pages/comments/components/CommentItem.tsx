import { Box, Typography, Avatar, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { formatRelativeTime } from "@utils/formatters";

export interface Comment {
  userName: string;
  imageUrl: string;
  commentText: string;
  creationDateTime: string;
  votes?: number;
}

interface Props {
  comment: Comment;
}

export default function CommentItem({ comment }: Props) {
  return (
    <Box display="flex" gap={2}>
      <Avatar src={comment.imageUrl} />

      <Box flex={1}>
        <Box display="flex" gap={1} alignItems="center">
          <Typography fontWeight={600}>{comment.userName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(comment.creationDateTime)}
          </Typography>
        </Box>

        <Typography
          mt={0.5}
          whiteSpace="pre-line"
          sx={{
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {comment.commentText}
        </Typography>

        <Box
          mt={1}
          display="inline-flex"
          alignItems="center"
          px={1}
          py={0.25}
          borderRadius={16}
          bgcolor="#f4f4f4"
          sx={{
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <IconButton
              size="small"
              disableRipple
              sx={{
                p: 0,
              }}
            >
              <ArrowUpwardIcon
                fontSize="small"
                color="primary"
                sx={{ mr: 0.5 }}
              />
              <Typography variant="caption" color="text.primary">
                {comment.votes ?? 0}
              </Typography>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
