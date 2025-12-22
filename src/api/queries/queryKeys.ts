import type { FetchIssuesParams } from "@data/issues.ts";

export const queryKeys = {
  issues: (params?: FetchIssuesParams) =>
    params ? (["issues", params] as const) : (["issues"] as const),
  offices: () => ["offices"],
};
