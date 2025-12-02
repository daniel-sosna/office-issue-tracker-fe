import { useQuery } from "@tanstack/react-query";
import { fetchOffices, type Office } from "../api/offices";

export function useOffices() {
  return useQuery<Office[], Error>({
    queryKey: ["offices"],
    queryFn: fetchOffices,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
