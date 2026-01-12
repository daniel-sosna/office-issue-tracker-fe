export const IssueStatus = {
  Open: "Open",
  InProgress: "In Progress",
  Resolved: "Resolved",
  Closed: "Closed",
  Blocked: "Blocked",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export type BackendIssueStatusType =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "BLOCKED";

export const backendToFrontendStatusMap: Record<
  BackendIssueStatusType,
  IssueStatusType
> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
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
  dateCreated: string;
  hasVoted: boolean;
  votes: number;
  comments: number;
  reportedBy?: string;
}

export interface IssueDetails extends Issue {
  officeId: string;
  office: string;
  reportedByAvatar: string;
  reportedByEmail: string;
  attachments: IssueAttachment[];
}

export interface IssueAttachment {
  id: string;
  url: string;
  format: string;
  originalFilename: string;
  fileSize: number;
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

export type IssueTab = 0 | 1 | 2 | 3 | 4 | 5;

export const IssueTab = {
  ALL: 0,
  OPEN: 1,
  PLANNED: 2,
  RESOLVED: 3,
  CLOSED: 4,
  REPORTED_BY_ME: 5,
} as const;

export interface User {
  id: string;
  name: string;
}
