export function ensureGMT(dateString?: string) {
    if (!dateString) return;

    let safeDateString = dateString;

    // This regular expression checks if the string ends with 'Z' (GMT) 
    // or has a timezone offset like '+02:00' or '-05:00' at the end.
    const hasTimezone = /(Z|[+-]\d{2}:\d{2})$/i.test(safeDateString);

    if (!hasTimezone) {
        // If there is no timezone indicator, force it to be GMT/UTC
        safeDateString += 'Z';
    }

    const parsedDate = new Date(safeDateString);
    
    // Check for an invalid date
    if (isNaN(parsedDate.getTime())) return;

    // Returns a valid JavaScript Date object that is securely anchored to GMT
    return parsedDate;
}

export function isToday(d?: string): boolean {
    const date = ensureGMT(d);
    if (!date) return false;
    
    const currentDate = new Date();
    
    // We can simply compare the date strings to see if they fall on the same day
    return date.toDateString() === currentDate.toDateString();
}

export function getDateFormatted(d?: string) {
    // ensureGMT returns a valid Date object, so we don't need 'new Date(date)' anymore
    const date = ensureGMT(d);
    if (!date) return;

    const today = new Date();
    
    // Create a date object for exactly 24 hours ago (yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Compare just the date portions (ignores the time)
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    // Fallback to the original formatting for older dates
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function getHourFormatted(d?: string) {
    const date = ensureGMT(d);
    if (!date) return;

    // By explicitly setting the timeZone, it guarantees Egypt time 
    // regardless of where the user or server is located!
    return date.toLocaleTimeString('en-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Africa/Cairo'
    });
}