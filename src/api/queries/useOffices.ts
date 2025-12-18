import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";
import { fetchOffices, type Office } from "@api/services/offices";

export function useOffices() {
  return useQuery<Office[], Error>({
    queryKey: queryKeys.offices,
    queryFn: fetchOffices,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}
