import { type IssueDetails, type IssueStatusType } from "@data/issues";
import { api } from "@api/httpClient";
import { ENDPOINTS } from "@api/urls";

export interface IssueData {
  summary: string;
  description: string;
  officeId: string;
}

export interface IssueDTO {
  votes: number;
  comments: number;
  id: string;
  summary: string;
  description: string;
  status: IssueStatusType;
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

export const fetchIssueDetails = async (
  issueId: string
): Promise<IssueDetails> => {
  const { data } = await api.get<IssueDetailsResponse>(
    ENDPOINTS.ISSUE_DETAILS.replace(":issueId", issueId)
  );

  return {
    id: data.issue.id,
    title: data.issue.summary,
    description: data.issue.description,
    status: data.issue.status,
    votes: data.issue.votes ?? 0,
    comments: data.issue.comments ?? 0,
    date: data.issue.date,
    office: data.office,
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar,
  };
};

export const createIssue = async (issue: IssueData): Promise<void> => {
  await api.post(ENDPOINTS.ISSUES, issue);
};

export const fetchIssues = async (
  page = 1,
  size = 10
): Promise<PaginatedIssuesResponse> => {
  const { data } = await api.get<PaginatedIssuesResponse>(ENDPOINTS.ISSUES, {
    params: { page, size },
  });
  return data;
};
