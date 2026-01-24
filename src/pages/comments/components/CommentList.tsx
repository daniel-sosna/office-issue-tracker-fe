import { Box } from "@mui/material";
import CommentItem, { type Comment } from "./CommentItem";

interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {comments.map((comment, index) => (
        <CommentItem key={index} comment={comment} />
      ))}
    </Box>
  );
}
