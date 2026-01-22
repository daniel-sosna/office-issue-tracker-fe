import { useEffect } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_KEYS } from "./useNotifications";
import type { Notification } from "@data/notification";
import { ENDPOINTS } from "@api/services/urls";

let stompClient: Client | null = null;

export const useNotificationSocket = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || stompClient?.active) return;

    stompClient = new Client({
      brokerURL: `ws://localhost:8080${ENDPOINTS.WS_NOTIFICATIONS}`,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("[WS] Connected");

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
