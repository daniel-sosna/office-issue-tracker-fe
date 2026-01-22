export type NotificationType = "UPVOTE" | "COMMENT" | "ISSUE_STATUS_CHANGE";

export interface Notification {
  id: string;
  issueId: string;
  type: NotificationType;
  message: string;
  readFlag: boolean;
  createdAt: string;
}
