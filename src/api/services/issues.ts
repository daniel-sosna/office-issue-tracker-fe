import {
  type Issue,
  type IssueDetails,
  type IssueStatusType,
  type FetchIssuesParams,
  type IssuePageResponse,
} from "@data/issues";
import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

export interface IssueData {
  summary: string;
  description: string;
  officeId: string;
}

export interface IssueDTO {
  votes: number | null;
  comments: number | null;
  id: string;
  summary: string;
  description: string;
  status: string;
  date: string;
}

export interface PaginatedIssuesResponse {
  content: IssueDTO[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

interface IssueDetailsResponse {
  issue: IssueDTO;
  office: string;
  reportedBy: string;
  reportedByAvatar: string;
}

function mapIssueStatus(apiStatus: string): IssueStatusType {
  const map: Record<string, IssueStatusType> = {
    OPEN: "Open",
    IN_PROGRESS: "In progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
    BLOCKED: "Blocked",
  };

  return map[apiStatus] ?? "Open";
}

export const fetchIssueDetails = async (
  issueId: string
): Promise<IssueDetails> => {
  const { data } = await api.get<IssueDetailsResponse>(
    ENDPOINTS.ISSUE_DETAILS.replace(":issueId", issueId)
  );

  const issue: Issue = {
    id: data.issue.id,
    title: data.issue.summary,
    description: data.issue.description,
    status: mapIssueStatus(data.issue.status),
    votes: data.issue.votes ?? 0,
    comments: data.issue.comments ?? 0,
    date: data.issue.date,
  };

  return {
    ...issue,
    office: data.office,
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar,
  };
};

export const createIssue = async (
  issue: IssueData,
  files?: File[]
): Promise<void> => {
  if (!files || files.length === 0) {
    await api.post(ENDPOINTS.ISSUES, issue);
    return;
  }
  const formData = new FormData();

  formData.append(
    "issue",
    new Blob([JSON.stringify(issue)], { type: "application/json" })
  );

  files.forEach((file) => {
    formData.append("files", file);
  });

  await api.post(ENDPOINTS.ISSUES, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchIssues = async (
  params: FetchIssuesParams
): Promise<IssuePageResponse> => {
  const { data } = await api.get<PaginatedIssuesResponse>(ENDPOINTS.ISSUES, {
    params,
  });

  const content: Issue[] = (data.content ?? []).map((issue) => ({
    id: issue.id,
    title: issue.summary,
    description: issue.description,
    status: mapIssueStatus(issue.status),
    votes: issue.votes ?? 0,
    comments: issue.comments ?? 0,
    date: issue.date,
  }));

  return {
    content,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    page: data.page,
    size: data.size,
  };
};
