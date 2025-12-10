import { useQuery } from "@tanstack/react-query";
import { fetchIssues } from "@api/issues";
import type { IssuePageResponse, FetchIssuesParams } from "@data/issues";
import { queryKeys } from "@data/queryKeys";

export function useIssues(params: FetchIssuesParams) {
  return useQuery<IssuePageResponse, Error>({
    queryKey: queryKeys.issues(params),
    queryFn: () => fetchIssues(params),
    staleTime: 1000 * 60 * 5,
  });
}
