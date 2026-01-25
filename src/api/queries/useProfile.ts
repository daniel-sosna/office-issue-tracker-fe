import { useQuery } from "@tanstack/react-query";
import { getMyProfile, type ProfileResponse } from "../services/profile";
import { queryKeys } from "./queryKeys";

export function useProfile() {
  return useQuery<ProfileResponse>({
    queryKey: queryKeys.profileMe(),
    queryFn: getMyProfile,
    staleTime: 60_000,
  });
}
