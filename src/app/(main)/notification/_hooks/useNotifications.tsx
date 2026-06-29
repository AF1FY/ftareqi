import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getNotificationsAsync,
    getUnReadAsync,
    markAsRead,
} from '@/lib/actions/Notification.actions';
import { parseNotificationMetaData } from '@/lib/services/notificationService';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AllNotificationMetadata, WalletTransactionMetadata, NotificationCategory, NotificationEventCode, AppNotification } from '@/types/Notifications';
import { Bell, Wallet, UserCheck, Eye } from "lucide-react";
import ModernCarIcon from '@/components/svg/ModernCarIcon';
import { isToday, isYesterday } from '@/lib/services/walletService';

export const categoryComponents: Record<NotificationCategory, React.ReactElement> = {
    [NotificationCategory.Ride]: (
        <ModernCarIcon size={28} className="rounded-full p-1" />
    ),
    [NotificationCategory.Wallet]: (
        <Wallet size={28} className="rounded-full p-1" />
    ),
    [NotificationCategory.DriverRegistration]: (
        <UserCheck size={28} className="rounded-full p-1" />
    ),
    [NotificationCategory.System]: (
        <Bell size={28} className="rounded-full p-1" />
    ),
    [NotificationCategory.Review]: (
        <Eye size={28} className="rounded-full p-1" />
    )
};

export const getNotifPreview = (category: NotificationCategory, metaData: AllNotificationMetadata): React.ReactElement => {
    switch (category) {
        case NotificationCategory.Wallet:
            const data = metaData as WalletTransactionMetadata;
            return (
                <>
                    <p className="line-clamp-2">{metaData.Preview || "No additional details"}</p>
                    {data.Amount && (<p>Amount : {data.Amount} EGP</p>)}
                </>
            )
        default:
            return <p className="line-clamp-2">{metaData.Preview || "No additional details"}</p>
    }
}

export const getNotifIconArrow = (code: NotificationEventCode): React.ReactElement => {
    if (code === NotificationEventCode.WalletCharged)
        return <i className="absolute bottom-0 right-0 fa-solid fa-arrow-left -rotate-45" />
    else if (code === NotificationEventCode.WalletWithdrawn)
        return <i className="absolute top-0 -right-1 fa-solid fa-arrow-right -rotate-45" />
    return <></>
}

export function getNotificationTextColor(code: NotificationEventCode): string {
    switch (code) {
        case NotificationEventCode.Approved:
        case NotificationEventCode.bookingAccepted:
            return 'text-approved-t';
        case NotificationEventCode.Rejected:
        case NotificationEventCode.bookingDeclined:
            return 'text-rejected-t';
        case NotificationEventCode.AmountReserved:
        case NotificationEventCode.Expired:
            return 'text-pending-t';
        default:
            return '';
    }
}

export const groupNotificationsByDate = (notifications: AppNotification<AllNotificationMetadata>[]) => {
    const groups: Record<string, AppNotification<AllNotificationMetadata>[]> = { 'Today': [], 'Yesterday': [], 'Older': [] };
    notifications.forEach((notif) => {
        if (isToday(notif.createdAt)) groups['Today'].push(notif);
        else if (isYesterday(notif.createdAt)) groups['Yesterday'].push(notif);
        else groups['Older'].push(notif);
    });
    return groups;
};

export const useGetInfiniteNotifications = (pageSize = 10) => {
    return useInfiniteQuery({
        queryKey: ['notifications-infinite'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getNotificationsAsync(pageParam, pageSize, 'true');

            if (!response?.success || !response.data) {
                throw new Error(response?.message || 'Failed to fetch notifications');
            }
            const parsedNotifications = response.data?.items.map(n => parseNotificationMetaData(n));
            const groupedUpdates = groupNotificationsByDate(parsedNotifications);
            return { ...response.data, groupedUpdates }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });
};

export const useGetNotifications = (page = 1, pageSize = 10) => {
    return useQuery({
        queryKey: ['notifications', page, pageSize],
        queryFn: async () => {
            const response = await getNotificationsAsync();
            if (!response?.success) {
                throw new Error(response?.message || 'Failed to fetch notifications');
            }
            const notifications = response.data?.items;
            const parsedNotifications = notifications?.map(n => parseNotificationMetaData(n));
            return parsedNotifications;
        },
    });
};

export const useGetUnreadCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async (): Promise<number> => {
            const res = await getUnReadAsync();
            if (!res.success)
                console.log('getUnReadAsync Failed : ', res);
            return res.data?.count ?? 0
        },
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await markAsRead(false, id);

            if (!response?.success) {
                throw new Error(response?.message || 'Failed to mark as read');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-infinite'] });
        },
    });
};

export const useMarkAllAsRead = ({setIsOpen}: {setIsOpen?: (value: boolean) => void}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await markAsRead(true);

            if (!response?.success) {
                throw new Error(response?.message || 'Failed to mark all as read');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-infinite'] });
            if(setIsOpen)
                setIsOpen(false);
        },
    });
};