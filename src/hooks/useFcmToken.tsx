import { registerFcmToken, requestForToken } from '@/lib/fcm';
import { useMutation } from '@tanstack/react-query';

export const useRegisterFcmToken = () => {
    return useMutation({
        mutationFn: async () => {
            const token = await requestForToken();

            if (!token) {
                throw new Error('User denied permission or token generation failed');
            }

            return registerFcmToken(token);
        },
        onSuccess: () => {
            console.log('FCM Token successfully synced with backend');
        },
        onError: (error) => {
            console.error('Error syncing FCM Token:', error);
        }
    });
};