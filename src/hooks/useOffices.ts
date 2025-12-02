import { useQuery } from "@tanstack/react-query";
import { fetchOffices, type Office } from "../api/offices";

export const useOffices = () => {
  return useQuery<Office[], unknown>({
    queryKey: ["offices"],
    queryFn: async () => {
      try {
        return await fetchOffices();
      } catch (err) {
        if (err instanceof Error) throw err;
        throw new Error("Unknown error occurred while fetching offices");
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
