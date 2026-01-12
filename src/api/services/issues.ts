import {
  type Issue,
  type IssueDetails,
  type IssueStatusType,
  type IssuePage,
  type IssueAttachment,
  type IssueStats,
} from "@data/issues";
import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

interface IssueBaseResponse {
  id: string;
  summary: string;
  description: string;
  status: IssueStatusType;
  dateCreated: string;
}

interface IssueResponse extends IssueBaseResponse {
  hasVoted: boolean;
  voteCount: number;
  commentCount?: number;
}

interface IssuePageResponse {
  content: IssueResponse[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

interface IssueDetailsResponse {
  issue: IssueBaseResponse;
  officeId: string;
  officeName: string;
  reportedBy: string;
  reportedByAvatar: string;
  reportedByEmail: string;
  attachments: IssueAttachment[];
}

export interface FetchIssuePageArgs {
  page: number;
  size: number;
  status?: IssueStatusType;
  reportedBy?: string;
  sort?: "latest" | "oldest" | "mostVotes";
  officeId?: string;
}

function normalizeIssue(issue: IssueResponse): Issue {
  return {
    ...issue,
    votes: issue.voteCount,
    comments: issue.commentCount ?? 0,
  };
}

export async function fetchIssues(
  params: FetchIssuePageArgs
): Promise<IssuePage> {
  const { data } = await api.get<IssuePageResponse>(ENDPOINTS.ISSUES, {
    params,
  });

  return {
    ...data,
    content: data.content.map(normalizeIssue),
  };
}

export async function fetchIssueDetails(
  issueId: string,
  stats: IssueStats
): Promise<IssueDetails> {
  const { data } = await api.get<IssueDetailsResponse>(
    ENDPOINTS.ISSUE_DETAILS.replace(":issueId", issueId)
  );

  return {
    ...data,
    ...normalizeIssue({
      ...data.issue,
      hasVoted: stats.hasVoted,
      voteCount: stats.votes,
      commentCount: stats.comments,
    }),
    office: data.officeName,
  };
}

export interface CreateIssuePayload {
  summary: string;
  description: string;
  officeId: string;
}

export interface CreateIssueArgs {
  issue: CreateIssuePayload;
  files?: File[];
}

export async function createIssue({
  issue,
  files,
}: CreateIssueArgs): Promise<void> {
  const formData = new FormData();
  formData.append(
    "issue",
    new Blob([JSON.stringify(issue)], { type: "application/json" })
  );
  (files ?? []).forEach((file) => formData.append("files", file));
  await api.post(ENDPOINTS.ISSUES, formData);
}

export async function updateIssue(
  issueId: string,
  data: { summary?: string; description?: string; officeId?: string },
  files?: File[],
  deleteAttachmentIds?: string[]
): Promise<void> {
  const formData = new FormData();
  formData.append(
    "issue",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  (files ?? []).forEach((f) => formData.append("files", f));
  (deleteAttachmentIds ?? []).forEach((id) =>
    formData.append("deleteAttachmentIds", id)
  );
  await api.patch(`${ENDPOINTS.ISSUES}/${issueId}`, formData);
}

export async function updateIssueStatus(
  issueId: string,
  status: IssueStatusType
): Promise<void> {
  await api.patch(`${ENDPOINTS.ISSUES}/${issueId}/status`, { status });
}

export async function softDeleteIssue(issueId: string): Promise<void> {
  await api.delete(`${ENDPOINTS.ISSUES}/${issueId}`);
}
export async function deleteAttachment(attachmentId: string): Promise<void> {
  await api.delete(`${ENDPOINTS.ATTACHMENTS}/${attachmentId}`);
}
