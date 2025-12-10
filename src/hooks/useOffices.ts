import { useQuery } from "@tanstack/react-query";
import { fetchOffices, type Office } from "@api/offices";
import { QUERY_KEYS } from "@hooks/queryKeys";

export const useOffices = () =>
  useQuery<Office[], Error>({
    queryKey: [QUERY_KEYS.OFFICES],
    queryFn: fetchOffices,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
