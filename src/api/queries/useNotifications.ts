import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  fetchNotificationsByIssue,
} from "@api/services/notifications";
import type { Notification } from "@data/notification";

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export const useNotifications = () =>
  useQuery<Notification[]>({
    queryKey: NOTIFICATION_KEYS.all,
    queryFn: fetchNotifications,
  });

export const useUnreadNotificationCount = () =>
  useQuery<number>({
    queryKey: NOTIFICATION_KEYS.unreadCount,
    queryFn: fetchUnreadNotificationCount,
  });

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(NOTIFICATION_KEYS.all, (old) =>
        old?.map((n) => ({ ...n, readFlag: true }))
      );
      queryClient.setQueryData<number>(NOTIFICATION_KEYS.unreadCount, () => 0);
    },
  });
};

export const useMarkSingleAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Notification[]>(NOTIFICATION_KEYS.all, (old) =>
        old?.map((n) => (n.id === id ? { ...n, readFlag: true } : n))
      );
      queryClient.setQueryData<number>(NOTIFICATION_KEYS.unreadCount, (old) =>
        old && old > 0 ? old - 1 : 0
      );
    },
  });
};

export const useNotificationsByIssue = (issueId: string) =>
  useQuery<Notification[]>({
    queryKey: ["notifications", "issue", issueId],
    queryFn: () => fetchNotificationsByIssue(issueId),
    enabled: !!issueId,
  });
