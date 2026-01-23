import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../services/profile";
import { queryKeys } from "./queryKeys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profileMe,
    queryFn: getMyProfile,
    staleTime: 60_000,
  });
}
