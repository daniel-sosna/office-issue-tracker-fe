import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";
import { fetchIssues } from "@api/services/issues";
import type { IssuePage, FetchIssuesParams } from "@data/issues";

export function useIssues(params: FetchIssuesParams) {
  return useQuery<IssuePage, Error>({
    queryKey: queryKeys.issues(params),
    queryFn: () => fetchIssues(params),
    staleTime: 1000 * 60 * 5,
  });
}
