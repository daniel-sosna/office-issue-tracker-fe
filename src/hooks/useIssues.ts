import { useQuery } from "@tanstack/react-query";
import { fetchIssues } from "../api/issues";
import type { FetchIssuesParams, IssuePageResponse } from "@data/issues";

export const useIssues = (params: FetchIssuesParams) => {
  return useQuery<IssuePageResponse, unknown>({
    queryKey: ["issues", params],
    queryFn: async () => {
      const res = await fetchIssues(params);
      return res;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
