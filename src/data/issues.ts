export const IssueStatus = {
  Open: "Open",
  InProgress: "In Progress",
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
  IN_PROGRESS: "In Progress",
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
  "In Progress": "IN_PROGRESS",
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
  id: string;
  summary: string;
  description: string;
  status: IssueStatusType;
  date: string;
  hasVoted: boolean;
  votes: number;
  comments: number;
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

export interface IssuePage {
  content: Issue[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export interface EmployeesDropdownProps {
  selectedUser: string | undefined;
  setSelectedUser: (id: string | undefined) => void;
  setPage: (page: number) => void;
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
  currentUserId?: string;
  disabled?: boolean;
}
