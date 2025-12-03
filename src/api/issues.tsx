import { type Issue, type IssueDetails } from "@data/issues";
import { csrfFetch } from "@utils/csrfFetch";

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

export const updateIssue = async (
  issueId: number,
  data: IssueData
): Promise<IssueDetails> => {
  const res = await csrfFetch(`http://localhost:8080/issues/${issueId}`, {
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
  issueId: number,
  status: string
): Promise<IssueDetails> => {
  const res = await csrfFetch(
    `http://localhost:8080/issues/${issueId}/status`,
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

export const fetchIssues = async (): Promise<Issue[]> => {
  const res = await csrfFetch("http://localhost:8080/issues");

  if (!res.ok) {
    throw new Error(`Failed to fetch issues (HTTP ${res.status})`);
  }

  return res.json() as Promise<Issue[]>;
};
