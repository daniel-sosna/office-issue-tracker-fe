import type { FetchIssuePageArgs } from "@api/services/issues";

export const queryKeys = {
  issues: (params?: FetchIssuePageArgs) =>
    params ? (["issues", params] as const) : (["issues"] as const),
  issueDetails: (issueId: string) => ["issueDetails", issueId] as const,
};
