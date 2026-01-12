import type { FetchIssuePageArgs } from "@api/services/issues";

export const queryKeys = {
  issues: (params?: FetchIssuePageArgs) =>
    params ? (["issues", params] as const) : (["issues"] as const),
  offices: () => ["offices"],
  issueDetails: (issueId: string) => ["issueDetails", issueId] as const,
  attachments: () => ["attachments"] as const,
};
