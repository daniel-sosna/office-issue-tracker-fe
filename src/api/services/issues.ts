import type {
  Issue,
  IssueDetails,
  IssueStatusType,
  FetchIssuesParams,
  IssuePageResponse,
} from "@data/issues";
import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

interface BackendIssueDTO {
  id: string;
  summary: string;
  description: string;
  status: IssueStatusType;
  createdBy: string;
  officeId: string;
  dateCreated: string;
  dateModified: string | null;
  hasVoted: boolean;
  voteCount: number;
  commentCount: number | null;
}

interface IssuePageResponseRaw {
  content: BackendIssueDTO[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

interface IssueDetailsResponse {
  issue: BackendIssueDTO;
  officeName: string;
  reportedBy: string;
  reportedByAvatar: string;
  reportedByEmail: string;
}

function normalizeIssue(i: BackendIssueDTO): Issue {
  return {
    id: i.id,
    summary: i.summary,
    description: i.description,
    status: i.status,
    createdBy: i.createdBy,
    officeId: i.officeId,
    dateCreated: i.dateCreated,
    hasVoted: i.hasVoted,
    votes: i.voteCount,
  };
}

export async function fetchIssues(
  params: FetchIssuesParams
): Promise<IssuePageResponse> {
  const { data } = await api.get<IssuePageResponseRaw>(ENDPOINTS.ISSUES, {
    params,
  });

  return {
    content: (data.content ?? []).map(normalizeIssue),
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    page: data.page,
    size: data.size,
  };
}

export async function fetchIssueDetails(
  issueId: string
): Promise<IssueDetails> {
  const { data } = await api.get<IssueDetailsResponse>(
    ENDPOINTS.ISSUE_DETAILS.replace(":issueId", issueId)
  );

  return {
    ...normalizeIssue(data.issue),
    dateModified: data.issue.dateModified,
    comments: data.issue.commentCount ?? 0,
    office: data.officeName,
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar,
    reportedByEmail: data.reportedByEmail,
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
  data: { summary: string; description: string; officeId: string },
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

export async function updateIssueOffice(
  issueId: string,
  officeId: string
): Promise<void> {
  await api.patch(`${ENDPOINTS.ISSUES}/${issueId}/office`, { officeId });
}

export async function softDeleteIssue(issueId: string): Promise<void> {
  await api.patch(`${ENDPOINTS.ISSUES}/${issueId}/delete`);
}
