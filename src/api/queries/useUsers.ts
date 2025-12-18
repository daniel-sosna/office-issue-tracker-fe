import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";
import { fetchUsers, type User } from "@api/services/users";

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}
