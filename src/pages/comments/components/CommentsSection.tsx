import { Box, Divider } from "@mui/material";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import { useComments } from "@api/queries/useComments";
import { useCreateComment } from "@api/queries/useCreateComment";

export default function CommentsSection({
  issueId,
}: {
  issueId: string;
  onCommentCreated: () => void;
}) {
  const { data: comments = [] } = useComments(issueId);
  const { mutate: createComment, isPending } = useCreateComment(issueId);

  return (
    <Box>
      <CommentList comments={comments} />

      <Divider sx={{ my: 2 }} />

      <CommentInput
        loading={isPending}
        onSubmit={(text) => createComment(text)}
      />
    </Box>
  );
}
