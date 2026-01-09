import { useQuery } from "@tanstack/react-query";
import { fetchOffices } from "@api/services/offices";
import { queryKeys } from "@api/queries/queryKeys";

export function useOffices() {
  return useQuery({
    queryKey: queryKeys.offices(),
    queryFn: fetchOffices,
    staleTime: 1000 * 60 * 10,
  });
}
