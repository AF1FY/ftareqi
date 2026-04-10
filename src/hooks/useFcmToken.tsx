import { registerFcmToken, requestForToken } from '@/lib/fcm';
import { useMutation } from '@tanstack/react-query';

// The custom React Query Hook
export const useRegisterFcmToken = () => {
    return useMutation({
        mutationFn: async () => {
            // Step 1: Request the token from Firebase
            const token = await requestForToken();

            if (!token) {
                throw new Error('User denied permission or token generation failed');
            }

            // Step 2: Send the successfully generated token to the backend
            return registerFcmToken(token);
        },
        onSuccess: () => {
            // Log success, or maybe show a subtle toast notification
            console.log('FCM Token successfully synced with backend');
        },
        onError: (error) => {
            // Handle the error gracefully
            console.error('Error syncing FCM Token:', error);
        }
    });
};