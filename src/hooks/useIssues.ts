// src/hooks/useIssues.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchIssues } from "@api/issues";
import type { FetchIssuesParams, IssuePageResponse } from "@data/issues";

export function useIssues(params: FetchIssuesParams) {
  return useQuery<IssuePageResponse, Error>({
    queryKey: ["issues", params],
    queryFn: async () => {
      try {
        return await fetchIssues(params);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw err;
        }
        throw new Error(String(err));
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}
