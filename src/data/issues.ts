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
  dateModified?: string | null;
  votes?: number;
  comments?: number;
}

export interface IssueDetails extends Issue {
  office: string;
  reportedBy: string;
  reportedByAvatar: string;
}
