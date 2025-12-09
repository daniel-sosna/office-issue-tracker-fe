export const backendToFrontendStatus: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  PENDING: "Pending",
  BLOCKED: "Blocked",
} as const;
