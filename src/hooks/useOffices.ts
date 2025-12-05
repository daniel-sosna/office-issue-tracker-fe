import { useQuery } from "@tanstack/react-query";
import { fetchOffices, type Office } from "@api/offices";

export const useOffices = () =>
  useQuery<Office[], Error>({
    queryKey: ["offices"],
    queryFn: fetchOffices,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
