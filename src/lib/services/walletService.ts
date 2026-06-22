import { getWalletAsync } from "../actions/Wallet.actions";

export function ensureGMT(dateString?: string) {
    if (!dateString) return;
    let safeDateString = dateString;
    const hasTimezone = /(Z|[+-]\d{2}:\d{2})$/i.test(safeDateString);
    if (!hasTimezone) {
        safeDateString += 'Z';
    }
    const parsedDate = new Date(safeDateString);
    if (isNaN(parsedDate.getTime())) return;
    return parsedDate;
}

export function isToday(d?: string): boolean {
    const date = ensureGMT(d);
    if (!date) return false;
    const currentDate = new Date();
    return date.toDateString() === currentDate.toDateString();
}

export function isYesterday(d?: string): boolean {
    const date = ensureGMT(d);
    if(!date) return false;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
}

export function isTomorrow(d?: string): boolean {
    const date = ensureGMT(d);
    if(!date) return false;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
}

export function getDateFormatted(d?: string) {
    const date = ensureGMT(d);
    if (!date) return;
    if (isToday(d))
        return 'Today';
    if (isYesterday(d))
        return 'Yesterday';
    if(isTomorrow(d))
        return 'Tomorrow';
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function getHourFormatted(d?: string) {
    const date = ensureGMT(d);
    if (!date) return;
    return date.toLocaleTimeString('en-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Africa/Cairo'
    });
}

export const getFullDateFormatted = (d?: string) => `${getDateFormatted(d)} ${getHourFormatted(d)}`;

export async function getBalanceAsync(): Promise<number> {
    const res = await getWalletAsync();
    if(res.success)
        return res.data?.balance ?? 0;
    console.error('Error getting user balance', res.message);
    return 0
}