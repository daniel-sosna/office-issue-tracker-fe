export const IssueStatus = {
  Open: "OPEN",
  InProgress: "IN_PROGRESS",
  Resolved: "RESOLVED",
  Blocked: "BLOCKED",
  Closed: "CLOSED",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface Issue {
  id: string;
  summary: string;
  description: string;
  status: IssueStatusType;
  createdBy: string;
  officeId: string;
  dateCreated: string;
  hasVoted: boolean;
  votes: number;
  comments: number;
}

export interface IssueDetails extends Issue {
  office: string;
  dateModified: string | null;
  reportedBy: string;
  reportedByAvatar: string;
  reportedByEmail: string;
}

export interface FetchIssuesParams {
  page: number;
  size: number;
  status?: IssueStatusType;
  reportedBy?: string;
  sort?: "latest" | "oldest" | "mostVotes";
  officeId?: string;
}

export interface IssuePageResponse {
  content: Issue[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}
