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
  issue: Issue;
  office: string;
  reportedBy: string;
  reportedByAvatar: string;
}

export const fetchIssueDetails = async (
  issueId: string
): Promise<IssueDetails> => {
  const res = await csrfFetch(
    `${BASE_URL}${ENDPOINTS.ISSUE_DETAILS.replace(":issueId", issueId)}`
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

export const createIssue = async (
  issue: IssueData,
  files?: File[]
): Promise<void> => {
  const formData = new FormData();

  formData.append(
    "issue",
    new Blob([JSON.stringify(issue)], { type: "application/json" })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await csrfFetch(`${BASE_URL}${ENDPOINTS.ISSUES}`, {
    method: "POST",
    body: formData,
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
