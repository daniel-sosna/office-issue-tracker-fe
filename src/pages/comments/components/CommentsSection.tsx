import { Alert, Box, Divider, Snackbar } from "@mui/material";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import { useComments } from "@api/queries/useComments";
import { useCreateComment } from "@api/queries/useCreateComment";
import { useState } from "react";

export default function CommentsSection({
  issueId,
  onCommentCreated,
}: {
  issueId: string;
  onCommentCreated: () => void;
}) {
  const { data: comments = [] } = useComments(issueId);
  const { mutate: createComment, isPending } = useCreateComment(issueId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateComment = (text: string) => {
    createComment(text, {
      onError: () => {
        setErrorMessage("Failed to create comment");
      },
      onSuccess: () => {
        onCommentCreated();
      },
    });
  };

  return (
    <Box>
      <CommentList comments={comments} />

      <Divider sx={{ my: 2 }} />

      <CommentInput loading={isPending} onSubmit={handleCreateComment} />

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
