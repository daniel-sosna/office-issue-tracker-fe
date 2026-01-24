import { useEffect } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_KEYS } from "./useNotifications";
import type { Notification } from "@data/notification";
import { ENDPOINTS } from "@api/services/urls";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

let stompClient: Client | null = null;

export const useNotificationSocket = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || stompClient?.active) return;

    const wsBaseUrl = BASE_URL.replace(/^http/, "ws");
    const brokerURL = `${wsBaseUrl}${ENDPOINTS.WS_NOTIFICATIONS}`;
    console.log(brokerURL);

    stompClient = new Client({
      brokerURL,
      reconnectDelay: 5000,

      onConnect: () => {
        stompClient?.subscribe(
          `/user/${userId}/queue/notifications`,
          (message: IMessage) => {
            const notification = JSON.parse(message.body) as Notification;

            queryClient.setQueryData<Notification[]>(
              NOTIFICATION_KEYS.all,
              (old) => (old ? [notification, ...old] : [notification])
            );

            queryClient.setQueryData<number>(
              NOTIFICATION_KEYS.unreadCount,
              (old) => (old ?? 0) + 1
            );
          }
        );
      },
    });

    void stompClient.activate();

    return () => {
      void stompClient?.deactivate();
      stompClient = null;
    };
  }, [userId, queryClient]);
};
