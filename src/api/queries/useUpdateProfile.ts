import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile, type ProfileRequest } from "../services/profile";
import { queryKeys } from "./queryKeys";

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileRequest) => updateMyProfile(payload),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.profileMe, updated);
    },
  });
}
