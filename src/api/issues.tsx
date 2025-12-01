import {
  type Issue,
  type IssueDetails,
  type IssueStatusType,
} from "@data/issues";
import { csrfFetch } from "@utils/csrfFetch";
import { BASE_URL, ENDPOINTS } from "./urls";

export interface IssueData {
  summary: string;
  description: string;
  officeId: string;
}

export interface IssueDTO {
  id: string;
  summary: string;
  description: string;
  officeId: string;
  status: IssueStatusType;
}

export interface PaginatedIssuesResponse {
  content: IssueDTO[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

interface IssueDetailsResponse {
  issue: Issue;
  office: string;
  reportedBy: string;
  reportedByAvatar: string;
}

export const fetchIssueDetails = async (
  issueId: string
): Promise<IssueDetails> => {
  const res = await csrfFetch(
    `http://localhost:8080/issues/${issueId}/details`
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as IssueDetailsResponse;

  return {
    ...data.issue,
    office: data.office,
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar,
  };
};

export const createIssue = async (issue: IssueData): Promise<void> => {
  const res = await csrfFetch(`${BASE_URL}${ENDPOINTS.ISSUES}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(issue),
  });

  if (!res.ok) {
    throw new Error("Failed to submit the issue");
  }

  await res.json();
};

export const fetchIssues = async (
  page = 1,
  size = 10
): Promise<PaginatedIssuesResponse> => {
  const res = await csrfFetch(
    `${BASE_URL}${ENDPOINTS.ISSUES}?page=${page}&size=${size}`
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as PaginatedIssuesResponse;
  return data;
};
