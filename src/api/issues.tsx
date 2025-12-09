import {
  type Issue,
  type IssueDetails,
  type IssueStatusType,
} from "@data/issues";
import { csrfFetch } from "@utils/csrfFetch.ts";
import { BASE_URL, ENDPOINTS } from "@api/urls.tsx";

export interface BackendIssueDTO {
  id: string;
  summary: string;
  description: string;
  status: string;
  createdBy: string;
  officeId: string;
  dateCreated: string;
  dateModified: string | null;
  votes: number | null;
  comments: number | null;
}

export interface IssueData {
  summary: string;
  description: string;
  officeId: string;
}

interface IssueDetailsResponse {
  issue: BackendIssueDTO;
  officeName: string;
  reportedBy: string;
  reportedByAvatar: string;
  reportedByEmail: string;
}

interface IssuePageResponse {
  content: BackendIssueDTO[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export const fetchIssueDetails = async (
  issueId: string
): Promise<IssueDetails> => {
  const res = await csrfFetch(
    `${BASE_URL}${ENDPOINTS.ISSUES}/${issueId}/details`
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as IssueDetailsResponse;

  const base: Issue = {
    id: data.issue.id,
    summary: data.issue.summary,
    description: data.issue.description,
    status: data.issue.status as IssueStatusType,
    createdBy: data.issue.createdBy,
    officeId: data.issue.officeId,
    dateCreated: data.issue.dateCreated,
    dateModified: data.issue.dateModified,
    votes: data.issue.votes ?? 0,
    comments: data.issue.comments ?? 0,
  };

  return {
    ...base,
    office: data.officeName,
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar,
    reportedByEmail: data.reportedByEmail,
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

export const updateIssue = async (
  issueId: string,
  data: IssueData
): Promise<IssueDetails> => {
  const res = await csrfFetch(`${BASE_URL}${ENDPOINTS.ISSUES}/${issueId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update issue (HTTP ${res.status})`);
  }

  return res.json() as Promise<IssueDetails>;
};

export const updateIssueStatus = async (
  issueId: string,
  status: string
): Promise<IssueDetails> => {
  const res = await csrfFetch(
    `${BASE_URL}${ENDPOINTS.ISSUES}/${issueId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update status (HTTP ${res.status})`);
  }

  return res.json() as Promise<IssueDetails>;
};

export const fetchIssues = async (
  page = 1,
  size = 10
): Promise<IssuePageResponse> => {
  const backendPage = page;

  const res = await csrfFetch(
    `${BASE_URL}${ENDPOINTS.ISSUES}?page=${backendPage}&size=${size}`
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return (await res.json()) as IssuePageResponse;
};
export const deleteIssue = async (issueId: string): Promise<void> => {
  const res = await csrfFetch(`${BASE_URL}${ENDPOINTS.ISSUES}/${issueId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete issue: HTTP ${res.status}`);
  }
};
