import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@api/services/comments";
import { queryKeys } from "@api/queries/queryKeys";
import type { Comment } from "@data/comments";
import type { IssuePage, Issue } from "@data/issues";

interface OptimisticContext {
  previousComments?: Comment[];
  previousIssueStats?: IssuePage;
}

export function useCreateComment(issueId: string) {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, string, OptimisticContext>({
    mutationFn: (commentText: string) =>
      createComment(issueId, { commentText }),

    onMutate: async (commentText) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments(issueId),
      });

      const previousComments = queryClient.getQueryData<Comment[]>(
        queryKeys.comments(issueId)
      );
      const previousIssueStats = queryClient.getQueryData<IssuePage>(
        queryKeys.issues()
      );
      const previousIssueDetails = queryClient.getQueryData<Issue>(
        queryKeys.issueDetails(issueId)
      );

      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        userName: "You",
        imageUrl: "",
        commentText,
        creationDateTime: new Date().toISOString(),
        votes: 0,
      };

      queryClient.setQueryData<Comment[]>(
        queryKeys.comments(issueId),
        (old = []) => [...old, optimisticComment]
      );

      queryClient.setQueryData<IssuePage | undefined>(
        queryKeys.issues(),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            content: old.content.map((issue: Issue) =>
              issue.id === issueId
                ? { ...issue, comments: (issue.comments ?? 0) + 1 }
                : issue
            ),
          };
        }
      );

      queryClient.setQueryData<Issue | undefined>(
        queryKeys.issueDetails(issueId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            comments: (old.comments ?? 0) + 1,
          };
        }
      );

      return { previousComments, previousIssueStats, previousIssueDetails };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          queryKeys.comments(issueId),
          context.previousComments
        );
      }
      if (context?.previousIssueStats) {
        queryClient.setQueryData<IssuePage | undefined>(
          queryKeys.issues(),
          context.previousIssueStats
        );
      }
      if (context?.previousIssueStats) {
        queryClient.setQueryData(
          queryKeys.issueDetails(issueId),
          context.previousIssueStats
        );
      }
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comments(issueId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.issues() });
    },
  });
}
