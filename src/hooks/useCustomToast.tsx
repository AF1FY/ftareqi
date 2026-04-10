import { toast } from "sonner";
import { ReactNode, useEffect, useState } from "react";

let notificationSound: HTMLAudioElement | null = null;

if (typeof window !== "undefined") {
    notificationSound = new Audio('/sounds/notification.mp3');
}

interface CustomToastProps {
    title: string;
    body: string;
    icon?: ReactNode;
    duration?: number;
}

export const useCustomToast = () => {
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

    useEffect(() => {
        const unlockAudio = () => {
            if (notificationSound && !isAudioUnlocked) {
                notificationSound.volume = 0;

                notificationSound.play().then(() => {
                    notificationSound!.pause();
                    notificationSound!.currentTime = 0;
                    notificationSound!.volume = 1;

                    setIsAudioUnlocked(true);

                    window.removeEventListener('click', unlockAudio);
                    window.removeEventListener('touchstart', unlockAudio);
                    window.removeEventListener('keydown', unlockAudio);
                }).catch((err) => {
                    console.log("Audio unlock pending user interaction...", err);
                });
            }
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);
        window.addEventListener('keydown', unlockAudio);

        return () => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
    }, [isAudioUnlocked]);

    const showNotification = ({
        title,
        body,
        icon,
        duration = 7000,
    }: CustomToastProps) => {

        if (notificationSound && isAudioUnlocked) {
            notificationSound.currentTime = 0;
            notificationSound.play().catch((err) => {
                console.warn("Failed to play audio even after unlock", err);
            });
        }

        toast(title, {
            description: body,
            icon: icon,
            duration: duration,
            position: 'top-right',
            style: {
                gap: 24
            }
        });
    };

    return { showNotification };
};