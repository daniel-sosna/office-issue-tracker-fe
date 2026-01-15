export const BASE_URL = "http://localhost:8080";
export const ENDPOINTS = {
  ISSUES: "/issues",
  ISSUE_DETAILS: "/issues/:issueId/details",
  ISSUE_VOTE: "/issues/:issueId/vote",
  OFFICES: "/offices",
  ISSUE_COMMENTS: "/issues/:issueId/comments",
  ISSUE_COMMENTS_CREATE: "/issues/:issueId/comments/create",
  USERS: "/api/users",
} as const;
