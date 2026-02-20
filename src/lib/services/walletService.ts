export function isToday(date?: string): boolean {
    if(!date) return false;
    const currentDate = new Date();
    return getDateFormatted(date) === currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function getDateFormatted(date?: string) {
    if(!date) return;
    const formatted = new Date(date);
    return formatted.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function getHourFormatted(date?: string) {
    if (!date) return;
    
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return;

    // This natively handles the 12-hour AM/PM conversion and zero-padding!
    return parsedDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}