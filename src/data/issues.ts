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
  dateCreated: string;
  hasVoted: boolean;
  votes: number;
  comments: number;
}

export interface IssueDetails extends Issue {
  officeId: string;
  office: string;
  dateModified: string | null;
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
