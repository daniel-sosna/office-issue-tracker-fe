import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@api/services/comments";
import { queryKeys } from "@api/queries/queryKeys";
import type { Comment } from "@data/comments";

export function useComments(issueId: string) {
  return useQuery<Comment[]>({
    queryKey: queryKeys.comments(issueId),
    queryFn: () => fetchComments(issueId),
    enabled: !!issueId,
  });
}
