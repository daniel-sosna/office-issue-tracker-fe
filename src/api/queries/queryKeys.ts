import type { FetchIssuePageArgs } from "@api/services/issues";

export const queryKeys = {
  issues: (params?: FetchIssuePageArgs) =>
    params ? (["issues", params] as const) : (["issues"] as const),
  offices: ["offices"] as const,
  users: ["users"] as const,
};
