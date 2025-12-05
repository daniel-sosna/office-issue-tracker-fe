import { useQuery } from "@tanstack/react-query";
import { fetchIssues } from "@api/issues";
import type { FetchIssuesParams, IssuePageResponse } from "@data/issues";

export function useIssues(params: FetchIssuesParams) {
  return useQuery<IssuePageResponse, Error>({
    queryKey: ["issues", params],
    queryFn: () => fetchIssues(params),
    placeholderData: undefined,
    staleTime: 1000 * 60 * 5,
  });
}
