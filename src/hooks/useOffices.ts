import { useQuery } from "@tanstack/react-query";
import { fetchOffices, type Office } from "../api/offices";

export const useOffices = () => {
  return useQuery<Office[], Error>({
    queryKey: ["offices"],
    queryFn: () => fetchOffices(),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
