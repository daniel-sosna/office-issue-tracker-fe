export const IssueStatus = {
  Open: "Open",
  InProgress: "In progress",
  Resolved: "Resolved",
  Closed: "Closed",
  Pending: "Pending",
  Blocked: "Blocked",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatusType;
  votes: number;
  comments: number;
  date: string;
}

export interface IssueDetails extends Issue {
  office: string;
  reportedBy: string;
  reportedByAvatar: string;
  attachments?: IssueAttachmentResponse[];
}

export interface IssueAttachmentResponse {
  id: string;
  url: string;
  format: string;
  originalFilename: string;
  fileSize: number;
}
