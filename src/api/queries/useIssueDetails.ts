import { useQuery } from "@tanstack/react-query";
import { fetchIssueDetails } from "@api/services/issues.ts";
import { queryKeys } from "@api/queries/queryKeys.ts";

export function useIssueDetails(issueId: string | null) {
  return useQuery({
    queryKey: issueId ? queryKeys.issueDetails(issueId) : [],
    queryFn: () => fetchIssueDetails(issueId!),
    enabled: !!issueId,
  });
}
