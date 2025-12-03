import type {
  Issue,
  IssueDetails,
  IssueStatusType,
  IssuePageResponse,
} from "@data/issues";
import { csrfFetch } from "@utils/csrfFetch";

export const API_BASE = "http://localhost:8080/issues";

export interface IssueData {
  summary: string;
  description: string;
  officeId: string;
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
    IN_PROGRESS: "In progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
  };
  return map[apiStatus] ?? "Open";
}

export const fetchIssueDetails = async (
  issueId: string
): Promise<IssueDetails> => {
  const res = await csrfFetch(`${API_BASE}/${issueId}/details`);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as IssueDetailsResponse;

  return {
    ...data.issue,
    office: data.office,
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar,
  };
};

export const createIssue = async (issue: IssueData): Promise<void> => {
  const res = await csrfFetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issue),
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

  const url = `${API_BASE}?${query.toString()}`;
  console.log(url);
  const res = await csrfFetch(url);

  if (!res.ok) throw new Error(`Failed to fetch issues: ${res.statusText}`);

  const response = (await res.json()) as IssuePageResponse;

  return {
    ...response,
    content: response.content.map((issue) => ({
      ...issue,
      status: mapIssueStatus(issue.status),
    })),
  };
};
