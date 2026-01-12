import {
  type Issue,
  type IssueDetails,
  type IssuePage,
  type IssueAttachment,
  type IssueStatusType,
  type BackendIssueStatusType,
  mapBackendStatus,
  mapFrontendStatus,
} from "@data/issues";
import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

interface IssueBaseResponse {
  id: string;
  summary: string;
  description: string;
  status: BackendIssueStatusType;
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
  issue: IssueResponse;
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
  status?: BackendIssueStatusType;
  reportedBy?: string;
  sort?: "latest" | "oldest" | "mostVotes";
  officeId?: string;
}

export interface FetchIssuesParams {
  page: number;
  size: number;
  status?: BackendIssueStatusType;
  reportedBy?: string;
  sort?: "dateDesc" | "dateAsc" | "votesDesc" | "commentsDesc";
  office?: string;
}

function normalizeIssue(issue: IssueResponse): Issue {
  return {
    id: issue.id,
    summary: issue.summary,
    description: issue.description,
    status: mapBackendStatus(issue.status),
    hasVoted: issue.hasVoted,
    votes: issue.voteCount,
    comments: issue.commentCount ?? 0,
    dateCreated: issue.dateCreated,
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
  issueId: string
): Promise<IssueDetails> {
  const { data } = await api.get<IssueDetailsResponse>(
    ENDPOINTS.ISSUE_DETAILS.replace(":issueId", issueId)
  );

  const issue: Issue = {
    id: data.issue.id,
    summary: data.issue.summary,
    description: data.issue.description,
    status: mapBackendStatus(data.issue.status),
    hasVoted: data.issue.hasVoted,
    votes: data.issue.voteCount,
    comments: data.issue.commentCount ?? 0,
    dateCreated: data.issue.dateCreated,
  };

  return {
    ...issue,
    officeId: data.officeId,
    office: data.officeName ?? "",
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar ?? "",
    reportedByEmail: data.reportedByEmail ?? "",
    attachments: data.attachments ?? [],
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
  await api.patch(`${ENDPOINTS.ISSUES}/${issueId}/status`, {
    status: mapFrontendStatus(status),
  });
}

export async function softDeleteIssue(issueId: string): Promise<void> {
  await api.delete(`${ENDPOINTS.ISSUES}/${issueId}`);
}
