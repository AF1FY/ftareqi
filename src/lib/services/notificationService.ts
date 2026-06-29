import {
  AllNotificationMetadata,
  AppNotification,
  BaseNotificationMetadata,
  NotificationCategory,
  NotificationEventCode,
  WalletTransactionMetadata,
} from "@/types/Notifications";
import { isToday, isYesterday, format } from "date-fns";

const groupNotificationsByDate = (
  notifications: AppNotification<AllNotificationMetadata>[],
) => {
  const groups: Record<string, AppNotification<AllNotificationMetadata>[]> = {
    Today: [],
    Yesterday: [],
    Older: [],
  };

  notifications.forEach((notif) => {
    const date = new Date(notif.createdAt);
    if (isToday(date)) {
      groups["Today"].push(notif);
    } else if (isYesterday(date)) {
      groups["Yesterday"].push(notif);
    } else {
      groups["Older"].push(notif);
    }
  });

  return groups;
};

export const parseNotificationMetaData = (
  notification: AppNotification<AllNotificationMetadata>,
): AppNotification<AllNotificationMetadata> => {
  try {
    if (!notification.data) {
      return {
        ...notification,
        data: { Preview: "" },
      };
    }

    if (notification.category === NotificationCategory.Wallet) {
      return {
        ...notification,
        data: notification.data as WalletTransactionMetadata,
      };
    }
    return {
      ...notification,
      data: notification.data as BaseNotificationMetadata,
    };
  } catch (error) {
    console.error("Failed to parse notification data string:", error);
    return {
      ...notification,
      data: { Preview: "" },
    };
  }
};

export const getNotificationRoute = (
  notification: AppNotification<AllNotificationMetadata>,
): string => {
  switch (notification.category) {
    case NotificationCategory.Ride:
      return notification.eventCode == NotificationEventCode.bookingRequest ? '/ride/trips/driver/requests'
        : notification.eventCode == NotificationEventCode.bookingAccepted ? 'ride/trips/rider/upcoming'
        : "/ride/trips";
    case NotificationCategory.Wallet:
      return "/wallet";
    case NotificationCategory.DriverRegistration:
      return "/profile";
    case NotificationCategory.Review:
    case NotificationCategory.System:
    default:
      return "/notification";
  }
};
