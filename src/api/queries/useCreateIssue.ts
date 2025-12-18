import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIssue, type CreateIssueArgs } from "@api/services/issues";
import { queryKeys } from "./queryKeys";

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
