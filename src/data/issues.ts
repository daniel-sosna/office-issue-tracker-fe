export const IssueStatus = {
  Open: "OPEN",
  InProgress: "IN_PROGRESS",
  Resolved: "RESOLVED",
  Closed: "CLOSED",
  Blocked: "BLOCKED",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatusType;
  date: string;
  hasVoted: boolean;
  votes: number;
  comments: number;
}

export interface IssueDetails extends Issue {
  office: string;
  reportedBy: string;
  reportedByAvatar: string;
}

export interface IssuePage {
  content: Issue[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}
