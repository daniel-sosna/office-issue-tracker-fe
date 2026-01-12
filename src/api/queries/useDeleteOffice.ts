import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOffice } from "@api/services/offices";
import { queryKeys } from "@api/queries/queryKeys";

export function useDeleteOffice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (officeId: string) => deleteOffice(officeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.offices(),
      });
    },
  });
}
