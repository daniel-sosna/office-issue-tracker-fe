import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchIssues } from "@api/issues";
import type { FetchIssuesParams, IssuePageResponse } from "@data/issues";
import { QUERY_KEYS } from "@hooks/queryKeys";

export function useIssues(params: FetchIssuesParams) {
  return useQuery<IssuePageResponse, Error>({
    queryKey: [QUERY_KEYS.ISSUES, params],
    queryFn: () => fetchIssues(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}
