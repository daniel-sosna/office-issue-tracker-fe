import {
  type Issue,
  type IssueDetails,
  type IssueStatusType,
  type IssuePageResponse,
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

export interface FetchIssuesParams {
  page: number;
  size: number;
  status?: string;
  reportedBy?: string;
  sort?: string;
  office?: string;
}

function mapIssueStatus(apiStatus: string): IssueStatusType {
  const map: Record<string, IssueStatusType> = {
    OPEN: "Open",
    IN_PROGRESS: "Planned",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
    PENDING: "Pending",
    BLOCKED: "Blocked",
  };

  return map[apiStatus] ?? "Open";
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

  if (!res.ok) throw new Error("Failed to submit the issue");

  await res.json();
};

export const fetchIssues = async (
  params: FetchIssuesParams
): Promise<IssuePageResponse> => {
  const query = new URLSearchParams();
  query.append("page", String(params.page));
  query.append("size", String(params.size));

  if (params.status) query.append("status", params.status);
  if (params.reportedBy) query.append("reportedBy", params.reportedBy);
  if (params.sort) query.append("sort", params.sort);
  if (params.office) query.append("office", params.office);

  const url = `${BASE_URL}${ENDPOINTS.ISSUES}?${query.toString()}`;
  const res = await csrfFetch(url);

  if (!res.ok) throw new Error(`Failed to fetch issues: ${res.statusText}`);

  const response = (await res.json()) as IssuePageResponse;

  return {
    ...response,
    content: response.content.map((issue) => ({
      ...issue,
      status: mapIssueStatus(issue.status),
      votes: issue.votes ?? 0,
      comments: issue.comments ?? 0,
    })),
  };
};
