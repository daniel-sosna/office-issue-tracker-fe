import { useQuery } from "@tanstack/react-query";
import { fetchOffices, type Office } from "../api/offices";

export const useOffices = () => {
  return useQuery<Office[], unknown>({
    queryKey: ["offices"],
    queryFn: async () => {
      const res = await fetchOffices();
      return res;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
