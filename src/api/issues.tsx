import { csrfFetch } from "@utils/csrfFetch";

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
  status: string;
}

export interface PaginatedIssuesResponse {
  content: IssueDTO[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export const createIssue = async (issue: IssueData): Promise<void> => {
  const res = await csrfFetch("http://localhost:8080/issues", {
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
    `http://localhost:8080/issues?page=${page}&size=${size}`
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as PaginatedIssuesResponse;
  return data;
};
