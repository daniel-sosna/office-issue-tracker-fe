import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@api/queries/queryKeys";
import { fetchIssues } from "@api/services/issues";
import type { IssuePage } from "@data/issues";
import type { FetchIssuePageArgs } from "@api/services/issues";

export function useIssues(params: FetchIssuePageArgs) {
  return useQuery<IssuePage, Error>({
    queryKey: queryKeys.issues(params),
    queryFn: () => fetchIssues(params),
    staleTime: 1000 * 60 * 5,
  });
}
