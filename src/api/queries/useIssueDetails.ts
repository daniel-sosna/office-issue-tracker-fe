import { useQuery } from "@tanstack/react-query";
import { fetchIssueDetails } from "@api/services/issues.ts";

export function useIssueDetails(issueId: string | null) {
  return useQuery({
    queryKey: ["issueDetails", issueId],
    queryFn: () => fetchIssueDetails(issueId!),
    enabled: !!issueId,
  });
}
