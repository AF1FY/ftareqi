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
        // We create an async setup function inside useEffect
        const setupNotificationListener = async () => {
            try {
                const msg = await messaging();

                // If messaging is not supported or not initialized, exit gracefully
                if (!msg) return;

                // Start listening for foreground messages
                // unsubscribe is a function returned by Firebase to stop listening when the component unmounts
                const unsubscribe = onMessage(msg, (payload) => {
                    const title = payload.notification?.title || "New Notification";
                    const body = payload.notification?.body || "";

                    showNotification({
                        title,
                        body,
                        icon: <BellRing className="bell"/>
                    })
                    queryClient.invalidateQueries({ queryKey: ['notifications' , 'unread-count'] });
                });

                // Cleanup listener when component unmounts to prevent memory leaks
                return () => {
                    unsubscribe();
                };
            } catch (error) {
                console.error("Error setting up FCM listener:", error);
            }
        };

        setupNotificationListener();
    }, [toast]);

    // This component doesn't render anything to the screen directly
    return null;
}