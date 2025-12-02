import { useQuery } from "@tanstack/react-query";
import { fetchIssues } from "../api/issues";
import type { FetchIssuesParams, IssuePageResponse } from "@data/issues";

export const useIssues = (params: FetchIssuesParams) => {
  return useQuery<IssuePageResponse, unknown>({
    queryKey: ["issues", params],
    queryFn: async () => {
      try {
        return await fetchIssues(params);
      } catch (err) {
        if (err instanceof Error) throw err;
        throw new Error("Unknown error occurred while fetching issues");
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
