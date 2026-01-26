import type { FetchIssuePageArgs } from "@api/services/issues";

export const queryKeys = {
  issues: (params?: FetchIssuePageArgs) =>
    params ? (["issues", params] as const) : (["issues"] as const),
  comments: (issueId: string) => ["comments", issueId] as const,
  offices: () => ["offices"],
  users: ["users"] as const,
  issueDetails: (issueId: string) => ["issueDetails", issueId] as const,
  attachments: () => ["attachments"] as const,
  profileMe: () => ["profile", "me"] as const,
};
