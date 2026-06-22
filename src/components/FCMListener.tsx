"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase"; // Adjust path to your firebase config
import { toast } from "sonner";
import { useCustomToast } from "@/hooks/useCustomToast";
import { BellRing } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function FCMListener() {
    const { showNotification } = useCustomToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        const setupNotificationListener = async () => {
            try {
                const msg = await messaging();
                if (!msg) return;
                const unsubscribe = onMessage(msg, (payload) => {
                    console.log('payload : ', payload); //* <---------------->
                    
                    const title = payload.notification?.title || "New Notification";
                    const body = payload.notification?.body || "";
                    showNotification({
                        title,
                        body,
                        icon: <BellRing className="bell"/>
                    })
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                    queryClient.invalidateQueries({ queryKey: ['notifications' , 'unread-count'] });
                    queryClient.invalidateQueries({ queryKey: ['notifications-infinite'] });
                });

                return () => {
                    unsubscribe();
                };
            } catch (error) {
                console.error("Error setting up FCM listener:", error);
            }
        };
        setupNotificationListener();
    }, [toast]);

    return null;
}