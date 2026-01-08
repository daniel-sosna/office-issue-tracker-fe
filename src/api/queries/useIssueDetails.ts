import { useQuery } from "@tanstack/react-query";
import { fetchIssueDetails } from "@api/services/issues";
import type { IssueDetails, IssueStats } from "@data/issues";
import { queryKeys } from "./queryKeys";

export function useIssueDetails(issueId: string, stats: IssueStats) {
  return useQuery<IssueDetails, Error>({
    enabled: !!issueId,
    queryKey: issueId
      ? queryKeys.issueDetails(issueId)
      : ["issueDetails", "none"],
    queryFn: () => fetchIssueDetails(issueId ?? "", stats),
    placeholderData: () => {
      if (!issueId) return undefined;
      return {
        ...stats,
        id: issueId,
        summary: "Loading...",
        description: "Loading...",
        status: "CLOSED",
        dateCreated: "2025-01-01 00:00:00.00000 +00:00",
        officeId: "",
        office: "Loading...",
        reportedBy: "Loading...",
        reportedByAvatar: "",
        reportedByEmail: "",
        attachments: [],
      } as IssueDetails;
    },
    staleTime: 1000 * 60 * 5,
  });
}
