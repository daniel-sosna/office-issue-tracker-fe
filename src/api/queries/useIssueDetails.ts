import { useQuery } from "@tanstack/react-query";
import { fetchIssueDetails } from "@api/services/issues";
import type { IssueDetails, IssueStats } from "@data/issues";
import { queryKeys } from "./queryKeys";

export function useIssueDetails(
  issueId?: string,
  stats: IssueStats = { hasVoted: false, votes: 0, comments: 0 }
) {
  return useQuery<IssueDetails, Error>({
    enabled: !!issueId,
    queryKey: issueId
      ? queryKeys.issueDetails(issueId)
      : ["issueDetails", "none"],
    queryFn: () => fetchIssueDetails(issueId ?? "", stats),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
}
