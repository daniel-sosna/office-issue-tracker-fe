export const BASE_URL = "http://localhost:8080";
export const ENDPOINTS = {
  ISSUES: "/issues",
  ISSUE_DETAILS: "/issues/:issueId/details",
  ISSUE_VOTE: "/issues/:issueId/vote",
  OFFICES: "/offices",
  USERS: "/api/getAllUsers",
} as const;
