import { useQuery } from "@tanstack/react-query";
import { fetchIssueDetails } from "@api/services/issues";
import type { IssueDetails } from "@data/issues";
import { queryKeys } from "./queryKeys";

export function useIssueDetails(issueId: string | null | undefined) {
  return useQuery<IssueDetails, Error>({
    enabled: !!issueId,
    queryKey: issueId
      ? queryKeys.issueDetails(issueId)
      : ["issueDetails", "none"],
    queryFn: () => fetchIssueDetails(issueId!),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
}
