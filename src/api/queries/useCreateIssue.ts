import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";
import { createIssue, type CreateIssueArgs } from "@api/services/issues";

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateIssueArgs>({
    mutationFn: async (vars) => {
      return await createIssue(vars);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.issues() });
    },
  });
}
