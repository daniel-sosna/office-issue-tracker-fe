import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";
import type { Comment } from "@data/comments";

interface CommentResponse {
  id: string;
  userName: string;
  imageUrl: string;
  commentText: string;
  creationDateTime: string;
  votes: number | null;
}

interface CreateCommentPayload {
  commentText: string;
}

function mapComment(apiComment: CommentResponse): Comment {
  return {
    id: apiComment.id,
    userName: apiComment.userName,
    imageUrl: apiComment.imageUrl,
    commentText: apiComment.commentText,
    creationDateTime: apiComment.creationDateTime,
    votes: apiComment.votes ?? 0,
  };
}

export const fetchComments = async (issueId: string): Promise<Comment[]> => {
  const { data } = await api.get<CommentResponse[]>(
    ENDPOINTS.ISSUE_COMMENTS.replace(":issueId", issueId)
  );

  return (data ?? []).map(mapComment);
};

export const createComment = async (
  issueId: string,
  payload: CreateCommentPayload
): Promise<Comment> => {
  const { data } = await api.post<CommentResponse>(
    ENDPOINTS.ISSUE_COMMENTS_CREATE.replace(":issueId", issueId),
    payload
  );

  return mapComment(data);
};
