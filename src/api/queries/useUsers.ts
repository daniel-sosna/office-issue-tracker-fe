import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";
import { fetchUsers } from "@api/services/users";
import { type User } from "@data/user";

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}
