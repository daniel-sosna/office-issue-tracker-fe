import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";
import { voteOnIssue, type VoteOnIssueArgs } from "@api/services/votes";
import type { IssuePage } from "@data/issues";

export function useVoteOnIssue() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, VoteOnIssueArgs>({
    mutationFn: voteOnIssue,

    onMutate: async ({ issueId, vote }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.issues() });

      queryClient.setQueriesData<IssuePage>(
        { queryKey: queryKeys.issues() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.map((issue) =>
              issue.id === issueId
                ? {
                    ...issue,
                    hasVoted: vote,
                    votes: vote ? issue.votes + 1 : issue.votes - 1,
                  }
                : issue
            ),
          };
        }
      );
    },

    onError: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.issues() });
    },
  });
}
