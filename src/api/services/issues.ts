import type {
  Issue,
  IssueDetails,
  IssueStatusType,
  FetchIssuesParams,
  IssuePageResponse,
} from "@data/issues";
import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

interface IssuePageResponseRaw {
  content: BackendIssueDTO[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

interface BackendIssueDTO {
  id: string;
  summary: string;
  description: string;
  status: IssueStatusType;
  createdBy: string;
  officeId: string;
  dateCreated: string;
  dateModified: string | null;
  votes: number | null;
  comments: number | null;
}

interface IssueDetailsResponse {
  issue: BackendIssueDTO;
  officeName: string;
  reportedBy: string;
  reportedByAvatar: string;
  reportedByEmail: string;
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

export async function fetchIssues(
  params: FetchIssuesParams
): Promise<IssuePageResponse> {
  const { data } = await api.get<IssuePageResponseRaw>(ENDPOINTS.ISSUES, {
    params,
  });

  return {
    ...data,
    content: data.content.map(
      (i: BackendIssueDTO): Issue => ({
        id: i.id,
        summary: i.summary,
        description: i.description,
        status: i.status,
        createdBy: i.createdBy,
        officeId: i.officeId,
        dateCreated: i.dateCreated,
        dateModified: i.dateModified,
        votes: i.votes ?? 0,
        comments: i.comments ?? 0,
      })
    ),
  };
}

export async function fetchIssueDetails(
  issueId: string
): Promise<IssueDetails> {
  const { data } = await api.get<IssueDetailsResponse>(
    `${ENDPOINTS.ISSUES}/${issueId}/details`
  );

  return {
    id: data.issue.id,
    summary: data.issue.summary,
    description: data.issue.description,
    status: data.issue.status,
    createdBy: data.issue.createdBy,
    officeId: data.issue.officeId,
    dateCreated: data.issue.dateCreated,
    dateModified: data.issue.dateModified,
    votes: data.issue.votes ?? 0,
    comments: data.issue.comments ?? 0,
    office: data.officeName,
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar,
    reportedByEmail: data.reportedByEmail,
  };
}

export async function createIssue(
  issue: { summary: string; description: string; officeId: string },
  files?: File[]
): Promise<void> {
  const formData = new FormData();

  formData.append(
    "issue",
    new Blob([JSON.stringify(issue)], { type: "application/json" })
  );

  (files ?? []).forEach((file) => {
    formData.append("files", file);
  });

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

  (files ?? []).forEach((file) => {
    formData.append("files", file);
  });

  (deleteAttachmentIds ?? []).forEach((id) => {
    formData.append("deleteAttachmentIds", id);
  });

  await api.put(`${ENDPOINTS.ISSUES}/${issueId}`, formData);
}

export async function updateIssueStatus(
  issueId: string,
  status: IssueStatusType | ""
): Promise<void> {
  await api.patch(`${ENDPOINTS.ISSUES}/${issueId}/status`, { status });
}

export async function updateIssueOffice(
  issueId: string,
  officeId: string
): Promise<void> {
  await api.patch(`${ENDPOINTS.ISSUES}/${issueId}/office`, {
    officeId,
  });
}

export async function softDeleteIssue(issueId: string): Promise<void> {
  await api.patch(`${ENDPOINTS.ISSUES}/${issueId}/delete`);
}
