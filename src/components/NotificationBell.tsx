"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Bell, Car, Wallet, UserCheck, Check } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useGetNotifications, useMarkAsRead, useMarkAllAsRead, useGetUnreadCount, categoryComponents } from "@/app/(main)/notification/_hooks/useNotifications";
import { AllNotificationMetadata, AppNotification } from "@/types/Notifications";
import { getDateFormatted, getHourFormatted } from "@/lib/services/walletService";
import { getNotificationRoute } from "@/lib/services/notificationService";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const { data: notifications, isLoading } = useGetNotifications();
    const { data: unreadCount = 0, isLoading: unReadCountIsLoading } = useGetUnreadCount();
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead({setIsOpen});

    const handleNotificationClick = (notification: AppNotification<AllNotificationMetadata>) => {
        // console.log("Clicked notification:", notification);
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
        const route = getNotificationRoute(notification);
        router.push(route);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`relative text-txt-secondary ${!isOpen && `bell-shake-hover`} transition-colors hover:bg-inherit rounded-full size-10`}
                >
                    <Bell className="relative size-5" />

                    {/* Badge for unread notifications */}
                    {!unReadCountIsLoading && unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-dodger-blue text-[10px] font-bold text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[calc(100vw-2rem)] sm:w-80 md:w-96 p-0 z-50 overflow-hidden shadow-lg border border-athens-gray rounded-xl"
                align="end"
                sideOffset={10}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">Notifications</h4>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-dodger-blue hover:text-dodger-blue/80 hover:bg-blue-50 h-8 px-2"
                        onClick={() => markAllAsRead()}
                        disabled={unreadCount === 0 || isLoading}
                    >
                        <Check className="h-3 w-3 me-1" />
                        Read All
                    </Button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto h-[60vh] max-h-[390px] bg-white-athens-gray [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {isLoading ? (
                        <div className="flex h-[390px] flex-col items-center justify-center gap-2 p-8 text-center text-sm text-txt-secondary">
                            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-pale-sky"></div>
                            Loading...
                        </div>
                    ) : notifications?.length === 0 ? (
                        <div className="flex h-[390px] flex-col items-center justify-center p-8 text-center text-pale-sky">
                            <Bell className="mb-2 size-8 text-foreground" />
                            <p className="text-sm text-txt-secondary">No new notifications.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-athens-gray">
                            {notifications?.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`relative flex items-center p-3 cursor-pointer transition-colors hover:bg-athens-gray/40`}
                                >
                                    {!notif.isRead && (
                                        <span className="absolute start-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-600" />
                                    )}

                                    <div className="shrink-0 rounded-full me-2">
                                        {categoryComponents[notif.category]}
                                    </div>

                                    <div className="flex flex-1 space-y-1 overflow-hidden pt-1">
                                        <div className="flex flex-col items-start flex-1 justify-between">
                                            <p className={`text-sm leading-tight ${!notif.isRead ? "font-semibold" : "font-medium"}`}>
                                                {notif.title}
                                            </p>
                                            <p className="line-clamp-2 text-xs leading-relaxed text-txt-secondary">
                                                {notif.data?.Preview || 'No more details'}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-end space-y-0.5 whitespace-nowrap text-[10px] text-txt-secondary">
                                            <p>{getDateFormatted(notif.createdAt)}</p>
                                            <p>{getHourFormatted(notif.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </PopoverContent>
        </Popover>
    );
}