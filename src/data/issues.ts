export const IssueStatus = {
  Open: "OPEN",
  InProgress: "IN_PROGRESS",
  Resolved: "RESOLVED",
  Blocked: "BLOCKED",
  Closed: "CLOSED",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface IssueStats {
  hasVoted: boolean;
  votes: number;
  comments: number;
}

export interface Issue extends IssueStats {
  id: string;
  summary: string;
  description: string;
  status: IssueStatusType;
  dateCreated: string;
}

export interface IssueDetails extends Issue {
  officeId: string;
  office: string;
  reportedBy: string;
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
