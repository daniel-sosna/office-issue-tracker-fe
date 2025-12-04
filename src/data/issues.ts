export const IssueStatus = {
  Open: "Open",
  Planned: "Planned",
  Resolved: "Resolved",
  Closed: "Closed",
  Pending: "Pending",
  Blocked: "Blocked",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface Issue {
  id: number;
  summary: string;
  description: string;
  status: IssueStatusType;
  votes: number;
  comments: number;
  date: string;
  reportedBy?: string;
}

export interface IssueDetails extends Issue {
  office: string;
  reportedByAvatar: string;
}

export interface FetchIssuesParams {
  page: number;
  size: number;
  status?:
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | "PENDING"
    | "BLOCKED";
  reportedBy?: string;
  sort?: "dateDesc" | "dateAsc" | "votesDesc" | "commentsDesc";
  office?: string;
}

export interface IssuePageResponse {
  content: Issue[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}
