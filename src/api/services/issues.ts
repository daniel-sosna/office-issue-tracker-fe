import {
  type Issue,
  type IssueDetails,
  type IssuePage,
  type IssueAttachment,
  type IssueStats,
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
  isOwner: boolean;
  hasVoted: boolean;
  voteCount: number;
  commentCount: number;
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
  reportedByEmail?: string;
  attachments: IssueAttachment[];
}

export type FrontendSortKey =
  | "latest"
  | "oldest"
  | "mostVotes"
  | "mostComments";

export interface FetchIssuePageArgs {
  page: number;
  size: number;
  status?: BackendIssueStatusType;
  reportedBy?: string;
  sort?: FrontendSortKey;
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

const sortMap: Record<FrontendSortKey, FetchIssuesParams["sort"]> = {
  latest: "dateDesc",
  oldest: "dateAsc",
  mostVotes: "votesDesc",
  mostComments: "commentsDesc",
};

function normalizeIssue(issue: IssueResponse): Issue {
  return {
    ...issue,
    status: mapBackendStatus(issue.status),
    votes: issue.voteCount,
    comments: issue.commentCount,
  };
}

export async function fetchIssues(
  params: FetchIssuePageArgs
): Promise<IssuePage> {
  const backendParams: FetchIssuesParams = {
    page: params.page,
    size: params.size,
    status: params.status,
    reportedBy: params.reportedBy,
    sort: params.sort ? sortMap[params.sort] : undefined,
    office: params.officeId,
  };

  const { data } = await api.get<IssuePageResponse>(ENDPOINTS.ISSUES, {
    params: backendParams,
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
      isOwner: stats.isOwner,
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
  files?: File[]
): Promise<void> {
  const formData = new FormData();
  formData.append(
    "issue",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  (files ?? []).forEach((file) => formData.append("files", file));
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
export async function deleteAttachment(attachmentId: string): Promise<void> {
  await api.delete(`${ENDPOINTS.ATTACHMENTS}/${attachmentId}`);
}
