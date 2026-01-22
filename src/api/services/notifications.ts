import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";
import type { Notification } from "@data/notification";

export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await api.get<Notification[]>(ENDPOINTS.NOTIFICATIONS);
  return res.data;
};

export const fetchUnreadNotificationCount = async (): Promise<number> => {
  const res = await api.get<number>(ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT);
  return res.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.post(ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ);
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.post(`${ENDPOINTS.NOTIFICATIONS_MARK_READ}/${id}`);
};

export const fetchNotificationsByIssue = async (
  issueId: string
): Promise<Notification[]> => {
  const res = await api.get<Notification[]>(
    `${ENDPOINTS.ACTIVITY_TAB_NOTIFICATION}/${issueId}`
  );
  return res.data;
};
