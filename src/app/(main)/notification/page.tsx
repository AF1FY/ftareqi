"use client";

import React from "react";
import { ChevronDown, Loader2, Bell } from "lucide-react";
import { categoryComponents, getNotificationTextColor, getNotifIconArrow, getNotifPreview, groupNotificationsByDate, useGetInfiniteNotifications, useGetUnreadCount, useMarkAllAsRead, useMarkAsRead } from "@/app/(main)/notification/_hooks/useNotifications";
import { AllNotificationMetadata, AppNotification } from "@/types/Notifications";
import { getDateFormatted, getHourFormatted } from "@/lib/services/walletService";
import { Button } from "@/components/ui/button";
import { getNotificationRoute } from "@/lib/services/notificationService";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();

  const {
    data: infiniteData,
    isLoading: isLoadingNotifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetInfiniteNotifications();

  const { mutate: markAllAsRead } = useMarkAllAsRead({});
  const { data: unreadCount = 0 } = useGetUnreadCount();
  const { mutate: markAsRead } = useMarkAsRead();

  const allNotificationsRaw = infiniteData?.pages.flatMap(page => page.items || []) || [];
  const groupedUpdates = groupNotificationsByDate(allNotificationsRaw);

  const handleNotificationClick = (notification: AppNotification<AllNotificationMetadata>) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    const route = getNotificationRoute(notification);
    router.push(route);
  };

  const renderUpdateCard = (notif: AppNotification<AllNotificationMetadata>) => {
    const iconTextColor = getNotificationTextColor(notif.eventCode);
    return (
      <div
        key={notif.id}
        onClick={() => handleNotificationClick(notif)}
        className="group relative flex gap-4 p-3 rounded-2xl bg-background border border-transparent shadow-[0px_10px_30px_rgba(11,28,48,0.03)] hover:border-athens-gray transition-all cursor-pointer"
      >
        {!notif.isRead && (
          <span className="absolute start-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-600" />
        )}
        <div className={`size-10 relative shrink-0 rounded-xl flex items-center justify-center ${iconTextColor}`}>
          {categoryComponents[notif.category]}
          {getNotifIconArrow(notif.eventCode)}
        </div>
        <div className="flex-1 pr-12">
          <h4 className={`text-sm mb-0.5 ${!notif.isRead ? 'font-bold' : 'font-medium'}`}>
            {notif.title}
          </h4>
          <div className='text-sm text-pale-sky'>
            {getNotifPreview(notif.category, notif.data)}
          </div>
        </div>
        <div className="shrink-0 text-end space-y-0.5 whitespace-nowrap text-[10px] text-txt-secondary">
          <p className="font-bold">{getDateFormatted(notif.createdAt)}</p>
          <p>{getHourFormatted(notif.createdAt)}</p>
        </div>
      </div>
    );
  };

  const renderGroupedList = (groupedData: Record<string, any[]>, renderCardFn: (notif: any) => React.ReactElement) => {
    return Object.entries(groupedData).map(([groupName, items]) => {
      if (items.length === 0) return null;
      return (
        <section key={groupName} className="space-y-4 mb-8">
          <h3 className="text-[0.6875rem] font-bold tracking-wider text-pale-sky/80 uppercase ml-1">{groupName}</h3>
          <div className="space-y-3">{items.map(renderCardFn)}</div>
        </section>
      );
    });
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-8 md:py-12 full-scn">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Notifications</h1>
          <p className="text-on-surface-variant mt-1 ms-1">Stay updated with latest activities</p>
        </div>
        <Button
          variant='ghost'
          onClick={() => markAllAsRead()}
          disabled={unreadCount === 0 || allNotificationsRaw.length === 0}
          className="text-sm font-bold underline decoration-2 underline-offset-4 text-dodger-blue hover:text-dodger-blue/80 transition-opacity"
        >
          Mark all read
        </Button>
      </div>
      <div className="space-y-2">
        {isLoadingNotifications ? (
          <div className="py-20 flex justify-center text-pale-sky">
            <Loader2 className="animate-spin size-8" />
          </div>
        ) : allNotificationsRaw.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-20 rounded-full bg-athens-gray/60 flex items-center justify-center mb-6">
              <Bell className="size-10" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">No notifications yet</h3>
            <p className="text-sm text-txt-secondary max-w-sm">
              When you get new updates, they will show up here.
            </p>
          </div>
        ) : (
          <>
            {renderGroupedList(groupedUpdates, renderUpdateCard)}
            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full bg-athens-gray/40 text-pale-sky hover:bg-athens-gray/80 transition-colors disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <><Loader2 className="size-4 animate-spin" /> Loading...</>
                  ) : (
                    <><ChevronDown className="size-4" /> Load More</>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}