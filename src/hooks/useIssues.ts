import { useQuery } from "@tanstack/react-query";
import { fetchIssues } from "../api/issues";
import type { FetchIssuesParams } from "@data/issues";

export const useIssues = (params: FetchIssuesParams) => {
  return useQuery({
    queryKey: ["issues", params],
    queryFn: () => fetchIssues(params),

    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
