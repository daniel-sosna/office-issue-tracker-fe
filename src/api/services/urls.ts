export const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
export const ENDPOINTS = {
  ISSUES: "/issues",
  ISSUE_DETAILS: "/issues/:issueId/details",
  ISSUE_VOTE: "/issues/:issueId/vote",
  OFFICES: "/offices",
  COUNTRIES: "/offices/countries",
  ISSUE_COMMENTS: "/issues/:issueId/comments",
  ISSUE_COMMENTS_CREATE: "/issues/:issueId/comments/create",
  USERS: "/api/users",
  ATTACHMENTS: "/attachments",
  PROFILE_ME: "/api/profile/me",
} as const;
