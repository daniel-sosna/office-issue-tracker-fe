import { Box, Typography, Avatar } from "@mui/material";
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
      </Box>
    </Box>
  );
}
