import type { FetchIssuesParams } from "@data/issues";

export const queryKeys = {
  issues: (params: FetchIssuesParams) => ["issues", params] as const,
};
