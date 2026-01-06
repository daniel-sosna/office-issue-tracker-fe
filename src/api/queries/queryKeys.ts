import type { FetchIssuesParams } from "@data/issues";

export const queryKeys = {
  issues: (params?: FetchIssuesParams) =>
    params ? (["issues", params] as const) : (["issues"] as const),
  offices: () => ["offices"],
  issueDetails: (issueId: string) => ["issueDetails", issueId],
};
