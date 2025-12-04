import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchOffices, type Office } from "@api/offices";

export const useOffices = () =>
  useQuery<Office[], Error>({
    queryKey: ["offices"],
    queryFn: async () => {
      try {
        const res = await fetchOffices();
        return res;
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
        throw new Error("Unknown error occurred while fetching offices");
      }
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
