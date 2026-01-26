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

  NOTIFICATIONS: "/api/notifications",
  NOTIFICATIONS_UNREAD_COUNT: "/api/notifications/unread_notification_count",
  NOTIFICATIONS_MARK_READ: "/api/notifications/mark_read",
  NOTIFICATIONS_MARK_ALL_READ: "/api/notifications/mark_all_read",
  ACTIVITY_TAB_NOTIFICATION: "/api/notifications/issues",

  WS_NOTIFICATIONS: "/notifications",
} as const;
