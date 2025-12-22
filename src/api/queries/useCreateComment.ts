import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@api/services/comments";
import { queryKeys } from "@api/queries/queryKeys";

export function useCreateComment(issueId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentText: string) =>
      createComment(issueId, { commentText }),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comments(issueId),
      });

      void queryClient.invalidateQueries({
        queryKey: ["issue", issueId],
      });

      void queryClient.invalidateQueries({
        queryKey: ["issues"],
      });
    },
  });
}
