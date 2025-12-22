import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@api/services/comments";
import { queryKeys } from "@api/queries/queryKeys";

export function useCreateComment(issueId: string, onIncrement?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentText: string) =>
      createComment(issueId, { commentText }),

    onSuccess: () => {
      onIncrement?.();

      void queryClient.invalidateQueries({
        queryKey: queryKeys.comments(issueId),
      });

      void queryClient.invalidateQueries({
        queryKey: ["issues"],
      });
    },
  });
}
