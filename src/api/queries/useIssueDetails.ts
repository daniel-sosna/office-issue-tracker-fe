import { useQuery } from "@tanstack/react-query";
import { fetchIssueDetails } from "@api/services/issues";
import type { IssueDetails, BackendIssueStatusType } from "@data/issues";
import { queryKeys } from "./queryKeys";
import { mapBackendStatus } from "@data/issues";

export function useIssueDetails(issueId?: string) {
  return useQuery<IssueDetails, Error>({
    enabled: !!issueId,
    queryKey: issueId
      ? queryKeys.issueDetails(issueId)
      : ["issueDetails", "none"],
    queryFn: () => fetchIssueDetails(issueId ?? ""),
    placeholderData: () => {
      if (!issueId) return undefined;

      const placeholder: IssueDetails = {
        id: issueId,
        summary: "Loading...",
        description: "Loading...",
        status: mapBackendStatus("CLOSED" as BackendIssueStatusType),
        date: "2025-01-01 00:00:00.00000 +00:00",
        officeId: "",
        office: "Loading...",
        reportedBy: "Loading...",
        reportedByAvatar: "",
        reportedByEmail: "",
        attachments: [],
        hasVoted: false,
        votes: 0,
        comments: 0,
      };

      return placeholder;
    },
    staleTime: 1000 * 60 * 5,
  });
}
