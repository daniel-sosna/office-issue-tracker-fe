import { IssueStatus, type IssueStatusType } from "@data/issues";

export function normalizeStatus(status: string): IssueStatusType {
  const upper = status.toUpperCase();

  const validStatuses = Object.values(IssueStatus);

  if (validStatuses.includes(upper as IssueStatusType)) {
    return upper as IssueStatusType;
  }

  throw new Error("Invalid issue status received from backend: " + status);
}
