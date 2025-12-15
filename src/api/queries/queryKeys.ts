import type { FetchIssuesParams } from "@data/issues";

export const queryKeys = {
  issues: (params?: FetchIssuesParams) =>
    params ? (["issues", params] as const) : (["issues"] as const),
};
