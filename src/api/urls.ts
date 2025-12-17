export const BASE_URL = "http://localhost:8080";
export const ENDPOINTS = {
  ISSUES: "/issues",
  ISSUE_DETAILS: "/issues/:issueId/details",
  OFFICES: "/offices",
  COUNTRIES: "/offices/countries",
} as const;
