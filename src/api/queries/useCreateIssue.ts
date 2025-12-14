import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIssue, type CreateIssueArgs } from "@api/services/issues";

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateIssueArgs>({
    mutationFn: async (vars) => {
      return await createIssue(vars);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}
