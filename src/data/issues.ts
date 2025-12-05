export const IssueStatus = {
  Open: "Open",
  Planned: "Planned",
  Resolved: "Resolved",
  Closed: "Closed",
  Pending: "Pending",
  Blocked: "Blocked",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export type BackendIssueStatusType =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "PENDING"
  | "BLOCKED";

export const backendToFrontendStatusMap: Record<
  BackendIssueStatusType,
  IssueStatusType
> = {
  OPEN: "Open",
  IN_PROGRESS: "Planned",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  PENDING: "Pending",
  BLOCKED: "Blocked",
};

export const frontendToBackendStatusMap: Record<
  IssueStatusType,
  BackendIssueStatusType
> = {
  Open: "OPEN",
  Planned: "IN_PROGRESS",
  Resolved: "RESOLVED",
  Closed: "CLOSED",
  Pending: "PENDING",
  Blocked: "BLOCKED",
};

export function mapBackendStatus(
  status: BackendIssueStatusType
): IssueStatusType {
  return backendToFrontendStatusMap[status] ?? "Open";
}

export function mapFrontendStatus(
  status: IssueStatusType
): BackendIssueStatusType {
  return frontendToBackendStatusMap[status];
}

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
  status?: BackendIssueStatusType;
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
