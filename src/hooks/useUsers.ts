import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers, type Users } from "@api/users";
import { QUERY_KEYS } from "@hooks/queryKeys";

export const useFetchUsers = () =>
  useQuery<Users[], Error>({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
