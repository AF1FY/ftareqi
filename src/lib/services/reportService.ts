export const getStatusColor = (status: string) => {
    switch (status) {
        case "Pending":
            return "bg-amber-100 text-amber-800 hover:bg-amber-100/80";
        case "Resolved":
            return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80";
        case "Rejected":
            return "bg-rose-100 text-rose-800 hover:bg-rose-100/80";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
};

export const getReasonColor = (reason: string) => {
    switch (reason) {
        case "Spam":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
        case "Harassment":
            return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
        case "Fraud":
            return "bg-red-100 text-red-800 hover:bg-red-100/80";
        default:
            return "bg-slate-100 text-slate-800 hover:bg-slate-100/80";
    }
};
