import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";
import { createIssue, type CreateIssueArgs } from "@api/services/issues";

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateIssueArgs>({
    mutationFn: ({ issue, files }: CreateIssueArgs) =>
      createIssue({ issue, files }),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.issues() });
    },
  });
}
